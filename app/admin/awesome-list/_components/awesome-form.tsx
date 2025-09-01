"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RepoStatus, AwesomeCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { H3 } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";

import { awesomeSchema } from "@/server/admin/awesome-list/schema";
import { upsertAwesome } from "@/server/admin/awesome-list/actions";
import { findAwesomeListById } from "@/server/admin/awesome-list/queries";

import { cx } from "@/lib/utils";

type AwesomeFormProps = ComponentProps<"form"> & {
  awesome?: NonNullable<Awaited<ReturnType<typeof findAwesomeListById>>>;
  title: string;
};

export function AwesomeForm({ className, title, awesome, ...props }: AwesomeFormProps) {
  const form = useForm({
    resolver: zodResolver(awesomeSchema),
    defaultValues: {
      name: awesome?.name ?? "",
      repositoryUrl: awesome?.repositoryUrl ?? "",
      description: awesome?.description ?? "",
      stars: awesome?.stars ?? 0,
      forks: awesome?.forks ?? 0,
      license: awesome?.license ?? "",
      owner: awesome?.owner ?? "",
      contributors: awesome?.contributors ?? "",
      firstCommitDate: awesome?.firstCommitDate ? new Date(awesome.firstCommitDate).toISOString().split("T")[0] : undefined,
      lastCommitDate: awesome?.lastCommitDate ? new Date(awesome.lastCommitDate).toISOString().split("T")[0] : undefined,
      status: awesome?.status ?? RepoStatus.Draft,
      category: awesome?.category ?? AwesomeCategory.Programming,
    },
  });

  const upsertAction = useServerAction(upsertAwesome, {
    onSuccess: () => {
      toast.success(`Awesome list successfully ${awesome ? "updated" : "created"}`);
    },
    onError: ({ err }) => {
      console.error("🔥 upsertAwesome error:", err);
      toast.error(err.message);
    },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fix the form errors before submitting.");
        return;
      }

      const formData = form.getValues();
      await upsertAction.execute({ id: awesome?.id, ...formData });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit the form. Please try again.");
    }
  };

  return (
    <>
      <Form {...form}>
        <Stack className="justify-between">
          <H3 className="flex-1 truncate">{title}</H3>
        </Stack>

        <form onSubmit={handleFormSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Awesome project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Repository URL */}
          <FormField
            control={form.control}
            name="repositoryUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/owner/repo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Owner */}
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner</FormLabel>
                <FormControl>
                  <Input placeholder="Repository owner" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* License */}
          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License</FormLabel>
                <FormControl>
                  <Input placeholder="MIT, Apache-2.0, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stars */}
          <FormField
            control={form.control}
            name="stars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stars</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forks */}
          <FormField
            control={form.control}
            name="forks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forks</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contributors */}
          <FormField
            control={form.control}
            name="contributors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contributors</FormLabel>
                <FormControl>
                  <Input placeholder="comma,separated,contributors" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Commit Date */}
          <FormField
            control={form.control}
            name="firstCommitDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Commit Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Commit Date */}
          <FormField
            control={form.control}
            name="lastCommitDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Commit Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="NonProgramming">Non-Programming</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description full width */}
          <div className="col-span-full">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short description of the repository" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="col-span-full">
            Save Awesome List
          </Button>
        </form>
      </Form>
    </>
  );
}
