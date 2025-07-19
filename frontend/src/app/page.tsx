import Home from '@/features/home/components/home';
import { paramsSchema } from '@/features/shared/schemas/page-params-schema';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parsedParams = paramsSchema.parse(await searchParams);
  return <Home searchParams={parsedParams} />;
}
