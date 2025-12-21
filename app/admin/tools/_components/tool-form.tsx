"use client";

import { isValidUrl, slugify } from "@primoui/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Tool, ToolStatus, ToolType } from "@prisma/client";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { use, useState } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { generateFavicon } from "@/actions/media";
import { MultiSelectCheckbox } from "@/components/admin/multi-select-checkbox";
import { RelationSelector } from "@/components/admin/relation-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToolPublishActions } from "./tool-publish-actions";
import { H3 } from "@/components/ui/heading";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "@/components/ui/link";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "@/components/web/external-link";
import { useComputedField } from "@/hooks/use-computed-field";
import type { findCategoryList } from "@/server/admin/categories/queries";
import { upsertTool, autoFillFromRepo, uploadToolMedia } from "@/server/admin/tools/actions";
import type { findToolBySlug } from "@/server/admin/tools/queries";
import type { findPlatformList } from "@/server/admin/platforms/queries";
import { StackCombobox } from "./stack-combobox";
import type { findStackList } from "@/server/admin/stacks/queries";
import { toolSchema, type ToolSchema } from "@/server/admin/tools/schema";
import { generateFaviconUrl, computeFaviconUrl } from "@/lib/url-utils";
import { cx } from "@/lib/utils";
import { AIModelSelector, DEFAULT_AI_MODELS } from "../../_components/ai-model-selector";

const ToolStatusChange = ({ tool }: { tool: Tool }) => {
  return (
    <>
      <ExternalLink href={`/${tool.slug}`} className="font-semibold underline inline-block">
        {tool.name}
      </ExternalLink>{" "}
      is now {tool.status.toLowerCase()}.{" "}
    </>
  );
};

type ToolFormProps = ComponentProps<"form"> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>;
  categoriesPromise: ReturnType<typeof findCategoryList>;
  platformsPromise: ReturnType<typeof findPlatformList>;
  stacksPromise: ReturnType<typeof findStackList>;
};

export function ToolForm({ className, title, tool, categoriesPromise, platformsPromise, stacksPromise, ...props }: ToolFormProps) {
  const router = useRouter();
  const categories = use(categoriesPromise);
  const platformOptions = use(platformsPromise);
  const stackOptions = use(stacksPromise);
  const [isStatusPending, setIsStatusPending] = useState(false);
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
      status: tool?.status ?? ToolStatus.Draft,
      publishedAt: tool?.publishedAt ?? null,
      categories: tool?.categories.map((c) => c.id) ?? [],
      platforms: tool?.platforms.map((p) => p.id) ?? [],
      type: tool?.type ?? "Tool",
      stacks: (tool?.stacks || []).map((s) => (typeof s === "string" ? { id: "", name: s, slug: s } : s)),
      screenshots:
        tool?.screenshots?.map((img) => ({
          imageUrl: img.imageUrl,
          caption: img.caption ?? "",
        })) ?? [],
    },
  });

  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat-v3.1:free");

  const autoFillAction = useServerAction(autoFillFromRepo, {
    onSuccess: ({ data }) => {
      if (data.name) form.setValue("name", data.name);
      if (data.tagline) form.setValue("tagline", data.tagline);
      if (data.websiteUrl) form.setValue("websiteUrl", data.websiteUrl);
      if (data.description) form.setValue("description", data.description);
      if (data.stacks) {
        form.setValue(
          "stacks",
          data.stacks.map((stackName: string) => ({
            id: "",
            name: stackName,
            slug: stackName.toLowerCase(),
          }))
        );
      }
      toast.success("Auto filled from repo 🎉");
    },
    onError: ({ err }) => toast.error(err.message),
  });

  const handleAutoFill = async () => {
    const repoUrl = form.getValues("repositoryUrl");
    if (!repoUrl) {
      toast.error("Please enter a repository URL first");
      return;
    }
    await autoFillAction.execute({ repositoryUrl: repoUrl, model: selectedModel });
  };

  // autofill slug based on name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tool,
  });

  if (!stacksPromise) {
    throw new Error("stacksPromise tidak diberikan ke ToolForm");
  }

  const {
    fields: screenshotFields,
    append: appendScreenshot,
    remove: removeScreenshot,
  } = useFieldArray({
    control: form.control,
    name: "screenshots",
  });

  const {
    fields: stackFields,
    append: appendStack,
    remove: removeStack,
  } = useFieldArray({
    control: form.control as unknown as Control<ToolSchema>,
    name: "stacks",
  });

  // Keep track of the form values
  const [websiteUrl, type, repoUrl] = form.watch(["websiteUrl", "type", "repositoryUrl"]);
  computeFaviconUrl({
    form,
    sourceFields: ["websiteUrl", "repositoryUrl", "type"],
    computedField: "faviconUrl",
    callback: (values) =>
      generateFaviconUrl({
        websiteUrl: values.websiteUrl || null,
        repoUrl: values.repositoryUrl || null,
        type: values.type || ToolType.Tool,
      }),
    enabled: !tool, // Hanya auto-generate saat create, tidak saat edit
  });
  // Upsert tool
  const upsertAction = useServerAction(upsertTool, {
    onSuccess: ({ data }) => {
      if (data.status !== originalStatus) {
        toast.success(<ToolStatusChange tool={data} />);
        setOriginalStatus(data.status);
      } else {
        toast.success(`Tool successfully ${tool ? "updated" : "created"}`);
      }

      if (!tool || data.slug !== tool?.slug) {
        router.push(`/admin/tools/${data.slug}`);
      }
    },

    onError: ({ err }) => {
      console.error("🔥 upsertAction onError:", err);
      toast.error(err.message);
    },
    onFinish: () => setIsStatusPending(false),
  });

  // Generate favicon
  const faviconAction = useServerAction(generateFavicon, {
    onSuccess: ({ data }) => {
      toast.success("Favicon successfully generated. Please save the tool to update.");
      form.setValue("faviconUrl", data);
    },

    onError: ({ err }) => toast.error(err.message),
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("🔥 Validation errors:", JSON.stringify(Error, null, 2));
        return;
      }

      const formData = form.getValues();

      await upsertAction.execute({ id: tool?.id, ...formData });
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  const handleStatusSubmit = async (status: ToolStatus, publishedAt: Date | null) => {
    form.setValue("status", status);
    form.setValue("publishedAt", publishedAt);

    // Get current form values
    const formData = form.getValues();

    // Submit directly
    await upsertAction.execute({ id: tool?.id, ...formData });
  };

  return (
    <Form {...form}>
      <Stack className="justify-between w-full">
        <H3 className="flex-1 truncate">{title}</H3>

        <div className="inline-flex -space-x-px divide-x divide-primary-foreground/30 rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
          <AIModelSelector models={DEFAULT_AI_MODELS} selectedModel={selectedModel} onModelChange={setSelectedModel} onAutoFill={handleAutoFill} isLoading={autoFillAction.isPending} />
        </div>
      </Stack>

      <form onSubmit={handleFormSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
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
        {/* Platforms Field (Multi-Select) */}
        <FormField
          control={form.control}
          name="platforms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platforms</FormLabel>
              <FormControl>
                <MultiSelectCheckbox options={platformOptions} value={field.value ?? []} onChange={field.onChange} />
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
                <select className="border rounded-md px-3 py-2 bg-background" value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                  <option value="Tool">Tool</option>
                  <option value="Template">Template</option>
                  <option value="Component">Component</option>
                  <option value="Asset">Asset</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stacks Field (Dynamic Input with useFieldArray) */}
        <FormItem>
          <FormLabel>Stacks</FormLabel>
          {stackFields.map((stack, index) => (
            <div key={stack.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`stacks.${index}`}
                render={({ field }) => (
                  <FormControl>
                    <Input
                      placeholder="Enter stack (e.g., React)"
                      value={field.value?.name || ""}
                      onChange={(e) => {
                        const name = e.target.value;
                        field.onChange({ name, id: "", slug: name.toLowerCase() });
                      }}
                    />
                  </FormControl>
                )}
              />
              <Button type="button" variant="secondary" size="sm" onClick={() => removeStack(index)}>
                Remove
              </Button>
            </div>
          ))}
          <StackCombobox options={stackOptions} onSelect={(stackObj) => appendStack(stackObj)} />

          <FormMessage />
        </FormItem>
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

        <div className="space-y-4 col-span-full">
          <h3 className="font-semibold text-lg">Screenshots</h3>

          {screenshotFields.map((screenshot, index) => (
            <div key={screenshot.id ?? index} className="grid sm:grid-cols-2 gap-4 items-start border p-4 rounded-xl">
              <Tabs defaultValue="url" className="col-span-2">
                <TabsList>
                  <TabsTrigger value="url">Input URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                {/* TAB 1: INPUT URL */}
                <TabsContent value="url" className="mt-2 space-y-4">
                  <FormField
                    control={form.control}
                    name={`screenshots.${index}.imageUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="upload" className="mt-2 space-y-4">
                  <FormItem>
                    <FormLabel>Upload Image / Video</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center w-full">
                        <label htmlFor={`file-upload-${index}`} className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Choose images</span> or drag & drop it here
                            </p>
                            <p className="text-xs text-muted-foreground">JPG, JPEG, PNG and WEBP. Max 20 MB.</p>
                          </div>
                          <input
                            id={`file-upload-${index}`}
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,video/mp4"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              try {
                                const [result, error] = await uploadToolMedia({
                                  toolName: form.getValues("name"),
                                  file,
                                });

                                if (error) {
                                  toast.error(`Upload gagal: ${error.message}`);
                                  return;
                                }

                                if (result?.url) {
                                  form.setValue(`screenshots.${index}.imageUrl`, result.url);
                                  toast.success("File berhasil diupload");
                                }
                              } catch (err: any) {
                                toast.error(`Upload gagal: ${err.message}`);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </FormControl>

                    {/* Preview lebih besar */}
                    {form.watch(`screenshots.${index}.imageUrl`) && (
                      <div className="flex justify-center mt-4">
                        {form.watch(`screenshots.${index}.imageUrl`).endsWith(".mp4") ? (
                          <video src={form.watch(`screenshots.${index}.imageUrl`)} className="rounded-lg max-w-md w-full border shadow-sm" controls />
                        ) : (
                          <img src={form.watch(`screenshots.${index}.imageUrl`)} alt="preview" className="rounded-lg max-w-md w-full border shadow-sm" />
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">JPG/PNG ≤ 1MB, MP4 ≤ 20MB</p>
                  </FormItem>
                </TabsContent>
              </Tabs>

              {/* Caption */}
              <FormField
                control={form.control}
                name={`screenshots.${index}.caption`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Homepage Screenshot" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Remove button */}
              <div className="col-span-2 text-right">
                <Button type="button" size="sm" variant="destructive" onClick={() => removeScreenshot(index)}>
                  Remove Screenshot
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" variant="secondary" onClick={() => appendScreenshot({ imageUrl: "", caption: "" })}>
            + Add Screenshot
          </Button>
        </div>

        <div className="grid gap-4 col-span-full grid-cols-2">
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
                      const faviconUrl = generateFaviconUrl({
                        websiteUrl,
                        repoUrl,
                        type: type ?? ToolType.Tool,
                      });

                      if (faviconUrl) {
                        form.setValue("faviconUrl", faviconUrl);
                      }
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
                    const aSegments = a.fullPath.split("/");
                    const bSegments = b.fullPath.split("/");
                    for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
                      if (aSegments[i] !== bSegments[i]) {
                        return aSegments[i].localeCompare(bSegments[i]);
                      }
                    }
                    return aSegments.length - bSegments.length;
                  }}
                />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>
          <ToolPublishActions tool={tool} isPending={upsertAction.isPending} isStatusPending={isStatusPending} onStatusSubmit={handleStatusSubmit} />
        </div>
      </form>
    </Form>
  );
}
