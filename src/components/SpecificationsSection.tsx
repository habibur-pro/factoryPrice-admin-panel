import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileText, X, RefreshCcw } from "lucide-react";

export interface Property {
  key: string;
  value: string;
}

export interface Specification {
  group: string;
  properties: Property[];
}

interface SpecificationsSectionProps {
  specs: Specification[];
  setSpecs: React.Dispatch<React.SetStateAction<Specification[]>>;
}

const SpecificationsSection = ({
  specs,
  setSpecs,
}: SpecificationsSectionProps) => {
  const [groups, setGroups] = useState<string[]>([
    "Technical",
    "Physical",
    "Features",
    "Requirements",
    "Other",
  ]);
  const [newGroup, setNewGroup] = useState<string>("");
  const [currentGroup, setCurrentGroup] = useState<string>("Technical");
  const [specKey, setSpecKey] = useState<string>("");
  const [specValue, setSpecValue] = useState<string>("");

  const addSpec = () => {
    if (!specKey || !specValue || !currentGroup) return;

    const newSpec = { key: specKey, value: specValue };
    const groupIndex = specs.findIndex((s) => s.group === currentGroup);

    if (groupIndex !== -1) {
      const updated = [...specs];
      updated[groupIndex].properties.push(newSpec);
      setSpecs(updated);
    } else {
      setSpecs([...specs, { group: currentGroup, properties: [newSpec] }]);
    }

    setSpecKey("");
    setSpecValue("");
  };

  const removeSpec = (group: string, key: string, value: string) => {
    setSpecs((prevSpecs) =>
      prevSpecs
        .map((spec) =>
          spec.group === group
            ? {
                ...spec,
                properties: spec.properties.filter(
                  (p) => p.key !== key || p.value !== value
                ),
              }
            : spec
        )
        .filter((spec) => spec.properties.length > 0)
    );
  };

  const addGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      setGroups([...groups, newGroup]);
      setCurrentGroup(newGroup);
      setNewGroup("");
    }
  };

  const resetAllSpecs = () => {
    setSpecs([]);
    setSpecKey("");
    setSpecValue("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-start space-x-2">
          <FileText className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-md font-medium">Product Specifications</h3>
            <p className="text-sm text-muted-foreground">
              Add technical details and specifications for your product
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={resetAllSpecs}
          className="flex items-center gap-1 text-destructive"
          disabled={specs.length === 0}
        >
          <RefreshCcw className="h-4 w-4" />
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="space-y-4">
          <div>
            <Label>Specification Group</Label>
            <div className="grid grid-cols-[1fr,auto] gap-2 mt-1">
              <Select value={currentGroup} onValueChange={setCurrentGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("new-group");
                  if (el) el.focus();
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="spec-key">Specification Name</Label>
              <Input
                id="spec-key"
                placeholder="e.g., Weight, Dimensions, Material"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="spec-value">Value</Label>
              <Input
                id="spec-value"
                placeholder="e.g., 500g, 10x15x2cm, Aluminum"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={addSpec}
              disabled={!specKey || !specValue}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Specification
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Label htmlFor="new-group">Add New Group</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="new-group"
                placeholder="New specification group"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
              />
              <Button
                type="button"
                onClick={addGroup}
                disabled={!newGroup || groups.includes(newGroup)}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Display Specs */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Added Specifications</h4>

          {specs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No specifications added yet
            </div>
          ) : (
            <div className="space-y-6">
              {specs.map((specGroup) => (
                <div key={specGroup.group}>
                  <h5 className="font-medium text-sm mb-2 bg-secondary/50 p-2 rounded">
                    {specGroup.group}
                  </h5>
                  <div className="space-y-2">
                    {specGroup.properties.map((prop, index) => (
                      <div
                        key={`${specGroup.group}-${prop.key}-${index}`}
                        className="flex justify-between items-center py-1 border-b"
                      >
                        <div className="font-medium">{prop.key}:</div>
                        <div className="flex items-center">
                          <span>{prop.value}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 ml-2 p-0"
                            onClick={() =>
                              removeSpec(specGroup.group, prop.key, prop.value)
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificationsSection;
