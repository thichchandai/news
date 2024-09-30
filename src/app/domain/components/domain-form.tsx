"use client";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addDomain } from "@/services/domain-service";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  name: z.string().min(1, { message: "Nhập tên miền" }),
});

export function DomainForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const respone = await addDomain(data);
    if (respone.status) {
      toast.success(respone.message);
      router.refresh();
    } else {
      toast.error(respone.message);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Nhập Tên Miền</FormLabel>
                  <FormControl>
                    <Input placeholder="wibusama.pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2 bg-green-500" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Thêm Tên Miền"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
