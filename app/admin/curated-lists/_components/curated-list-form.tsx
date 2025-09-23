"use client";

import { type ComponentProps, use } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useServerAction } from "zsa-react";
import { H3 } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "@/components/ui/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RelationSelector } from "@/components/admin/relation-selector";
import { upsertCuratedList } from "@/server/admin/curated-list/actions";
import { curatedListSchema } from "@/server/admin/curated-list/schema";
import type { findToolList } from "@/server/admin/tools/queries";
import { findCuratedListById } from "@/server/admin/curated-list/queries";
import { CuratedListActions } from "@/app/admin/curated-lists/_components/curated-list-actions";
import { cx } from "@/lib/utils";

type CuratedListFormProps = ComponentProps<"form"> & {
  curatedList?: Awaited<ReturnType<typeof findCuratedListById>>;
  toolsPromise: ReturnType<typeof findToolList>;
};

export function CuratedListForm({ className, title, curatedList, toolsPromise, ...props }: CuratedListFormProps) {
  const router = useRouter();
  const tools = use(toolsPromise);

  const form = useForm({
    resolver: zodResolver(curatedListSchema),
    defaultValues: {
      title: curatedList?.title ?? "",
      url: curatedList?.url ?? "",
      description: curatedList?.description ?? "",
      type: curatedList?.type ?? "gallery",
      tools: curatedList?.tools.map((t) => t.id) ?? [],
    },
  });

  const upsertAction = useServerAction(upsertCuratedList, {
    onSuccess: ({}) => {
      toast.success(`Curated List successfully ${curatedList ? "updated" : "created"}`);
      router.push("/admin/curated-lists");
    },
    onError: ({ err }) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit((data) => {
    upsertAction.execute({ id: curatedList?.id, ...data });
  });

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>
        <Stack size="sm" className="-my-0.5">
          {curatedList && <CuratedListActions curatedList={curatedList} size="md" />}
        </Stack>
      </Stack>

      <form onSubmit={handleSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <select {...field} className="border rounded px-2 py-1">
                  <option value="gallery">Gallery</option>
                  <option value="favicon">Favicon</option>
                  <option value="slider">Slider</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tools"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Tools</FormLabel>
              <RelationSelector relations={tools} selectedIds={field.value ?? []} setSelectedIds={field.onChange} />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/curated-lists">Cancel</Link>
          </Button>

          <Button size="md" isPending={upsertAction.isPending}>
            {curatedList ? "Update list" : "Create list"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
