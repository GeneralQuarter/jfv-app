import type { Plant } from './types/plant';
import type { SearchEntry, SearchEntryGroup } from './types/search-entry';
import type { SearchWorkerMessage } from './types/search-worker-message';
import type { Tags } from './types/tags';

let searchEntryGroups: SearchEntryGroup[] = [];
let resultsCache: Record<string, SearchEntryGroup[]> = {};

function normalizeSearchTerm(term: string): string {
  return term
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function normalizeSearchTerms(terms: string[]): string[] {
  return terms.map(normalizeSearchTerm);
}

function data({ plants, tags }: { plants: Plant[]; tags: Tags }) {
  const sponsors = new Set<string>();

  const plantEntries: SearchEntry[] = plants.map((plant) => {
    if (plant.sponsor) {
      sponsors.add(plant.sponsor);
    }

    return {
      id: plant.id,
      primaryText: plant.code,
      secondaryText: plant.commonName,
      tertiaryText: plant.sponsor,
      searchTerms: normalizeSearchTerms(
        [plant.code, plant.fullLatinName, plant.commonName].concat(
          plant.sponsor ? [plant.sponsor] : [],
        ),
      ),
    };
  });

  const sponsorEntries: SearchEntry[] = [...sponsors].map((sponsor) => ({
    id: sponsor,
    primaryText: sponsor,
    searchTerms: normalizeSearchTerms([sponsor]),
  }));

  searchEntryGroups = [
    {
      id: 'tags',
      headerText: 'Tags',
      entries: [
        {
          id: 'sponsored',
          primaryText: 'Parrainé',
          searchTerms: ['parraine'],
        },
        ...Object.entries(tags).map<SearchEntry>(([tagId, label]) => ({
          id: tagId,
          primaryText: label,
          searchTerms: normalizeSearchTerms([label]),
        })),
      ],
    },
    {
      id: 'sponsors',
      headerText: 'Parrains/Marraines',
      entries: sponsorEntries,
    },
    {
      id: 'plants',
      headerText: 'Plantes',
      entries: plantEntries,
    },
  ];
}

let timeoutId: number | undefined;

function debounceSearch(searchTerm: string) {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    search(searchTerm);
  }, 300);
}

function search(searchTerm: string) {
  const normalizedTerm = normalizeSearchTerm(searchTerm);

  if (normalizedTerm.length < 2) {
    self.postMessage([]);
    return;
  }

  if (resultsCache[normalizedTerm]) {
    self.postMessage(resultsCache[normalizedTerm]);
    return;
  }

  const results = searchEntryGroups
    .map((group) => ({
      ...group,
      entries: group.entries
        .filter((entry) =>
          entry.searchTerms.some((t) => t.includes(normalizedTerm)),
        )
        .sort((a, b) => a.primaryText.localeCompare(b.primaryText))
        .slice(0, 100),
    }))
    .filter((group) => group.entries.length > 0);

  if (Object.keys(resultsCache).length > 100) {
    resultsCache = {};
  }

  resultsCache[normalizedTerm] = results;

  self.postMessage(results);
}

const eventHandlerByType: {
  [K in SearchWorkerMessage as K['type']]: (data: K['data']) => void;
} = {
  data,
  search: debounceSearch,
};

self.onmessage = (e: MessageEvent<SearchWorkerMessage>) => {
  // @ts-expect-error data type should be correct
  eventHandlerByType[e.data.type]?.(e.data.data);
};
