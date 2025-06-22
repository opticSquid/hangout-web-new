export interface AddLocationProps {
  onSubmit: (lat: number, lon: number) => Promise<void>;
}
