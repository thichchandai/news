"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addLink } from "@/services/path-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Domain = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
};

const formSchema = z.object({
  title: z.string().min(1, { message: "Nhập title" }),
  domain: z.string().min(1, {
    message: "Chọn tên miền",
  }),
  slug: z.string().min(1, {
    message: "Nhập link slug",
  }),
  shopee: z.string().min(1, {
    message: "Nhập link shopee",
  }),
  autoOff: z.boolean({
    message: "Chọn auto off",
  }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size < 3000000, {
      message: "Ảnh nhỏ hơn 3MB.",
    }),
});

const CardLink = ({ domains }: { domains: Domain[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      domain: "",
      slug: "",
      shopee: "",
      autoOff: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (data.image === undefined) {
      const respone = await addLink({ ...data });
      if (respone.status) {
        console.log(respone);
        toast.success("Tạo Link thành công");
        router.push("/link");
      } else {
        toast.error(respone.message);
      }
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(data.image);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const respone = await addLink({ ...data, image: base64Image });
        if (respone.status) {
          toast.success("Tạo Link Thành Công");
          router.push("/link");
        } else {
          toast.error(respone.message);
        }
      };
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bẫy Link</CardTitle>
        <CardDescription>Bẫy link shopee dạng click link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Tile</FormLabel>
                    <FormControl>
                      <Input placeholder="tên bài viết..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Tên Miền</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tên miền" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {domains.map((domain, index) =>
                            domain.status === "WORKING" ? (
                              <SelectItem
                                key={index}
                                value={domain.id.toString()}
                              >
                                {domain.name}
                              </SelectItem>
                            ) : null
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="tên link..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shopee"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Link Shopee</FormLabel>
                    <FormControl>
                      <Input placeholder="link shopee..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autoOff"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Auto off sau 30p</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Ảnh</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="application/png"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-2 bg-green-500 hover:bg-green-600">
                Tạo Link
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CardLink;
