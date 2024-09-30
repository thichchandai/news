"use server";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDomain } from "@/services/domain-service";
import CardLink from "./component/CardLink";

type Domain = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
};

const getData = async (): Promise<Domain[]> => {
  const response = await getDomain();

  if (response.status) {
    return response.message as unknown as Domain[];
  }
  return [];
};

export default async function Home() {
  const domains = await getData();
  return (
    <Layout>
      <Tabs defaultValue="link" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="link">Bẫy Link</TabsTrigger>
          <TabsTrigger value="new">Bẫy Bài Viết</TabsTrigger>
        </TabsList>
        <TabsContent value="link">
          <CardLink domains={domains} />
        </TabsContent>
        <TabsContent value="new">asdazzsda</TabsContent>
      </Tabs>
    </Layout>
  );
}
