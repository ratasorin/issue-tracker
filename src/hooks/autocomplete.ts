import debounce from "debounce";
import { useState } from "react";
import { loader as autocompleteLoader } from "~/routes/api.google-autocomplete.$input";

export type GoogleAutocompleteResponse = Awaited<
  ReturnType<typeof autocompleteLoader>
>;
export const useAutocompleteSuggestionFromGoogle = () => {
  const [predictions, setPredictions] =
    useState<GoogleAutocompleteResponse | null>(null);
  const refreshAutocompleteInput = debounce((input: string) => {
    console.log({ input });
    fetch(`/api/google-autocomplete/${input}`)
      .then((r) => r.json())
      .then(setPredictions);
  }, 500);

  return { refreshAutocompleteInput, predictions };
};
