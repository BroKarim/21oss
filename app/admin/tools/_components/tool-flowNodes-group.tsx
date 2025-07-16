import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FlowNodeGroup({ control, nodeIndex, removeParent }: { control: any; nodeIndex: number; removeParent: () => void }) {
  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: `flowNodes.${nodeIndex}.children`,
  });

  return (
    <div className="rounded-xl border p-4 space-y-4 col-span-full">
      {/* Parent */}
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <FormField
          control={control}
          name={`flowNodes.${nodeIndex}.label`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Label</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Landing Page" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`flowNodes.${nodeIndex}.screenshots`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshots URL (pisah baris)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="https://..." />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Children */}
      <div className="space-y-2">
        {childFields.map((child, childIndex) => (
          <div key={child.id ?? childIndex} className="grid sm:grid-cols-2 gap-4 items-end">
            <FormField
              control={control}
              name={`flowNodes.${nodeIndex}.children.${childIndex}.label`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Child Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`flowNodes.${nodeIndex}.children.${childIndex}.repositoryPath`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Path</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="col-span-2 text-right">
              <Button type="button" size="sm" variant="destructive" onClick={() => removeChild(childIndex)}>
                Hapus Child
              </Button>
            </div>
          </div>
        ))}

        <Button type="button" size="sm" variant="secondary" onClick={() => appendChild({ label: "", repositoryPath: "" })}>
          + Tambah Child
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="button" size="sm" variant="destructive" onClick={removeParent}>
          Hapus Parent
        </Button>
      </div>
    </div>
  );
}
