import Papa from "papaparse";
export function parseCSV(file: File, callback: (data: unknown[]) => void) {
  Papa.parse(file, {
    header: true,
    complete: (result) => callback(result.data)
  });
}
