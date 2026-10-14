import api from '@/api/axios';

export async function downloadCertificate(id: number, reference: string): Promise<void> {
  const { data } = await api.get<Blob>(`/declarations/${id}/pdf`, { responseType: 'blob' });
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `acte-naissance-${reference}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
