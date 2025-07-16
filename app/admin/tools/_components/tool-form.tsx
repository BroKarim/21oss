"use client";

import { formatDateTime, getRandomString, isValidUrl, slugify } from "@primoui/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Tool, ToolStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { use, useState } from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { generateFavicon } from "@/actions/media";
import { RelationSelector } from "@/components/admin/relation-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { H3 } from "@/components/ui/heading";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import { FlowNodeGroup } from "./tool-flowNodes-group";
import { ExternalLink } from "@/components/web/external-link";
import { useComputedField } from "@/hooks/use-computed-field";
import type { findCategoryList } from "@/server/admin/categories/queries";
import { upsertTool } from "@/server/admin/tools/actions";
import type { findToolBySlug } from "@/server/admin/tools/queries";
import { toolSchema } from "@/server/admin/tools/schema";
import { cx } from "@/lib/utils";

const ToolStatusChange = ({ tool }: { tool: Tool }) => {
  return (
    <>
      <ExternalLink href={`/${tool.slug}`} className="font-semibold underline inline-block">
        {tool.name}
      </ExternalLink>{" "}
      is now {tool.status.toLowerCase()}.{" "}
      {tool.status === "Scheduled" && (
        <>
          Will be published on {formatDateTime(tool.publishedAt ?? new Date(), "long")} ({Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/^.+\//, "")}).
        </>
      )}
    </>
  );
};

type ToolFormProps = ComponentProps<"form"> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>;
  categoriesPromise: ReturnType<typeof findCategoryList>;
};

export function ToolForm({ className, title, tool, categoriesPromise, ...props }: ToolFormProps) {
  const router = useRouter();
  const categories = use(categoriesPromise);

  const [originalStatus, setOriginalStatus] = useState(tool?.status ?? ToolStatus.Draft);

  const form = useForm({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: tool?.name ?? "",
      slug: tool?.slug ?? "",
      tagline: tool?.tagline ?? "",
      description: tool?.description ?? "",
      websiteUrl: tool?.websiteUrl ?? "",
      affiliateUrl: tool?.affiliateUrl ?? "",
      repositoryUrl: tool?.repositoryUrl ?? "",
      faviconUrl: tool?.faviconUrl ?? "",
      screenshotUrl: tool?.screenshotUrl ?? "",
      status: tool?.status ?? ToolStatus.Draft,
      publishedAt: tool?.publishedAt ?? null,
      categories: tool?.categories.map((c) => c.id) ?? [],
      platforms: tool?.platforms.map((p) => p.id) ?? [],
      stacks: tool?.stacks.map((s) => s.slug) ?? [],
      flowNodes:
        tool?.flowNodes?.map((node) => ({
          label: node.label,
          screenshots: node.screenshots?.map((s) => s.imageUrl) ?? [],
          children:
            node.children?.map((child) => ({
              label: child.label,
              repositoryPath: child.repositoryPath ?? "",
            })) ?? [],
        })) ?? [],
    },
  });

  // otomatis isi form slug berdasarkan nama
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tool,
  });

  const {
    fields: flowNodes,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "flowNodes",
  });

  // Keep track of the form values
  const [name, slug, websiteUrl, description] = form.watch(["name", "slug", "websiteUrl", "description"]);

  // Upsert tool
  const upsertAction = useServerAction(upsertTool, {
    onSuccess: ({ data }) => {
      // If status has changed, show a status change notification
      if (data.status !== originalStatus) {
        toast.success(<ToolStatusChange tool={data} />);
        setOriginalStatus(data.status);
      }
      // Otherwise, just show a success message
      else {
        toast.success(`Tool successfully ${tool ? "updated" : "created"}`);
      }

      // If not updating a tool, or slug has changed, redirect to the new tool
      if (!tool || data.slug !== tool?.slug) {
        router.push(`/admin/tools/${data.slug}`);
      }
    },

    onError: ({ err }) => toast.error(err.message),
  });

  // Generate favicon
  const faviconAction = useServerAction(generateFavicon, {
    onSuccess: ({ data }) => {
      toast.success("Favicon successfully generated. Please save the tool to update.");
      form.setValue("faviconUrl", data);
    },

    onError: ({ err }) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("🔥 Submitting Tool Data", data);

    console.log("➡️ Executing upsertAction now...");

    upsertAction.execute({ id: tool?.id, ...data });
  });

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>
      </Stack>

      <form onSubmit={handleSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliate URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-xl col-span-full border p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 items-end w-full">
            {/* Parent Label */}
            <FormItem>
              <FormLabel>Parent Label</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Landing Page" />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Upload Screenshot */}
            <FormItem>
              <FormLabel>Screenshots (untuk parent)</FormLabel>
              <FormControl>
                <Input type="file" multiple />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          {/* Child Nodes */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Child Label */}
              <FormItem>
                <FormLabel>Child Label</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Home, About" />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* Repo Path */}
              <FormItem>
                <FormLabel>Repository Path</FormLabel>
                <FormControl>
                  <Input placeholder="/app/(web)/(home)/page.tsx" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            {/* Tombol tambah child */}
            <Button type="button" size="sm" variant="secondary">
              + Tambah Child
            </Button>
          </div>

          {/* Tombol hapus parent */}
          <div className="flex justify-end">
            <Button type="button" size="sm" variant="destructive">
              Hapus Parent Ini
            </Button>
          </div>
        </div>

        {/* Tombol tambah parent */}
        <div className="text-right col-span-full">
          <Button type="button" variant="secondary">
            + Tambah Parent Baru
          </Button>
        </div>

        {flowNodes.map((node, index) => (
          <FlowNodeGroup key={node.id ?? index} control={form.control} nodeIndex={index} removeParent={() => remove(index)} />
        ))}
        <div className="text-right col-span-full">
          <Button type="button" variant="secondary" onClick={() => append({ label: "", screenshots: [], children: [] })}>
            + Tambah Parent Baru
          </Button>
        </div>

        <div className="grid gap-4 @2xl:grid-cols-2"></div>

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel className="flex-1">Favicon URL</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  prefix={<RefreshCw className={cx(faviconAction.isPending && "animate-spin")} />}
                  className="-my-1"
                  disabled={!isValidUrl(websiteUrl) || faviconAction.isPending}
                  onClick={() => {
                    faviconAction.execute({
                      url: websiteUrl,
                      path: `tools/${slug || getRandomString(12)}`,
                    });
                  }}
                >
                  {field.value ? "Regenerate" : "Generate"}
                </Button>
              </Stack>

              <Stack size="sm">
                {field.value && <img src={field.value} alt="Favicon" className="size-8 border box-content rounded-md object-contain" />}

                <FormControl>
                  <Input type="url" className="flex-1" {...field} />
                </FormControl>
              </Stack>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <RelationSelector
                relations={categories}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
                mapFunction={({ id, name, fullPath }) => {
                  const depth = fullPath.split("/").length - 1;
                  const prefix = "- ".repeat(depth);
                  return { id, name: `${prefix}${name}` };
                }}
                sortFunction={(a, b) => {
                  // Split paths into segments for comparison
                  const aSegments = a.fullPath.split("/");
                  const bSegments = b.fullPath.split("/");

                  // Compare each segment
                  for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
                    if (aSegments[i] !== bSegments[i]) {
                      return aSegments[i].localeCompare(bSegments[i]);
                    }
                  }

                  // If all segments match up to the shorter path length,
                  // the shorter path comes first
                  return aSegments.length - bSegments.length;
                }}
                prompt={
                  name &&
                  description &&
                  `From the list of available categories below, suggest relevant categories for this link: 
                  
                  - URL: ${websiteUrl}
                  - Meta title: ${name}
                  - Meta description: ${description}.
                  `
                }
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>
          <Button type="submit" variant="fancy" name="submit">
            Publish
          </Button>
        </div>
      </form>
    </Form>
  );
}
