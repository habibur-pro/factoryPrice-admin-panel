import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VariantType {
  id: string;
  name: string;
  values: string[];
}

interface VariantTypeManagerProps {
  variantTypes: VariantType[];
  setVariantTypes: React.Dispatch<React.SetStateAction<VariantType[]>>;
  onVariantTypesChange: (types: VariantType[]) => void;
}

const VariantTypeManager = ({
  variantTypes,
  setVariantTypes,
  onVariantTypesChange,
}: VariantTypeManagerProps) => {
  const [newTypeName, setNewTypeName] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");

  const addVariantType = () => {
    if (newTypeName.trim()) {
      const newType: VariantType = {
        id: `type-${Date.now()}`,
        name: newTypeName.trim(),
        values: [],
      };
      const updatedTypes = [...variantTypes, newType];
      setVariantTypes(updatedTypes);
      onVariantTypesChange(updatedTypes);
      setNewTypeName("");
    }
  };

  const removeVariantType = (typeId: string) => {
    const updatedTypes = variantTypes.filter((type) => type.id !== typeId);
    setVariantTypes(updatedTypes);
    onVariantTypesChange(updatedTypes);
  };

  const addValueToType = (typeId: string) => {
    if (newValue.trim()) {
      const updatedTypes = variantTypes.map((type) => {
        if (type.id === typeId) {
          return {
            ...type,
            values: [...type.values, newValue.trim()],
          };
        }
        return type;
      });
      setVariantTypes(updatedTypes);
      onVariantTypesChange(updatedTypes);
      setNewValue("");
    }
  };

  const removeValueFromType = (typeId: string, valueIndex: number) => {
    const updatedTypes = variantTypes.map((type) => {
      if (type.id === typeId) {
        return {
          ...type,
          values: type.values.filter((_, index) => index !== valueIndex),
        };
      }
      return type;
    });
    setVariantTypes(updatedTypes);
    onVariantTypesChange(updatedTypes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Variant Types</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Manage Types
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Manage Variant Types</DialogTitle>
              <DialogDescription>
                Create and manage variant types like Color, Size, RAM, etc.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter variant type (e.g., Color, Size, RAM)"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addVariantType()}
                />
                <Button onClick={addVariantType} disabled={!newTypeName.trim()}>
                  Add Type
                </Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {variantTypes.map((type) => (
                  <div key={type.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{type.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariantType(type.id)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {type.values.map((value, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-secondary px-2 py-1 rounded text-sm"
                        >
                          <span>{value}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1"
                            onClick={() => removeValueFromType(type.id, index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder={`Add ${type.name.toLowerCase()} value`}
                        value={editingType === type.id ? newValue : ""}
                        onChange={(e) => {
                          setEditingType(type.id);
                          setNewValue(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addValueToType(type.id);
                            setEditingType(null);
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          addValueToType(type.id);
                          setEditingType(null);
                        }}
                        disabled={!newValue.trim() || editingType !== type.id}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {variantTypes.map((type) => (
          <div key={type.id} className="border rounded-lg p-3">
            <h4 className="font-medium mb-2">{type.name}</h4>
            <div className="flex flex-wrap gap-1">
              {type.values.slice(0, 3).map((value, index) => (
                <span
                  key={index}
                  className="bg-secondary px-2 py-1 rounded text-xs"
                >
                  {value}
                </span>
              ))}
              {type.values.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{type.values.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantTypeManager;
