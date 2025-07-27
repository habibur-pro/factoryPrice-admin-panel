import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight, X } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import {
  useAddCategoryMutation,
  useGetChildCategoriesQuery,
  useGetTopLevelCategoriesQuery,
  useGetCategoryPathQuery,
} from "@/redux/api/categoryApi"; // Adjust the import path as needed

interface Category {
  id: string; // This will be the _id from the API
  categoryName: string; // Renamed from 'name' to match API
  parent: string | null; // Renamed from 'parentId' to match API
  ancestors?: Category[]; // To hold the full path from getCategoryPath
}

interface NestedCategorySelectorProps {
  value?: string;
  onChange: (categoryId: string) => void;
}

export const NestedCategorySelector: React.FC<NestedCategorySelectorProps> = ({
  value,
  onChange,
}) => {
  const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // RTK Query Hooks
  const { data: topLevelCategoriesData } = useGetTopLevelCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [addCategory] = useAddCategoryMutation();

  // State to hold dynamically loaded categories
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);

  // Effect to initialize categories with top-level data
  useEffect(() => {
    if (topLevelCategoriesData?.data) {
      // Map API data to Category interface for consistency
      const mappedCategories = topLevelCategoriesData.data.map((cat: any) => ({
        id: cat._id,
        categoryName: cat.categoryName,
        parent: cat.parent,
      }));
      setDynamicCategories(mappedCategories);
    }
  }, [topLevelCategoriesData]);

  // Effect to load the initial path if a value is provided
  const { data: categoryPathData  } = useGetCategoryPathQuery(value!, {
    skip: !value, // Skip if no value is provided
  });

  useEffect(() => {
    if (value && categoryPathData?.data) {
      const path: Category[] = [];
      // Add ancestors first, then the selected category itself
      if (categoryPathData.data.ancestors) {
        categoryPathData.data.ancestors.forEach((ancestor: any) => {
          path.push({
            id: ancestor._id,
            categoryName: ancestor.categoryName,
            parent: ancestor.parent,
          });
        });
      }
      path.push({
        id: categoryPathData.data._id,
        categoryName: categoryPathData.data.categoryName,
        parent: categoryPathData.data.parent,
      });
      setSelectedPath(path);
    } else if (!value) {
      // Clear selected path if value becomes null or empty
      setSelectedPath([]);
    }
  }, [value, categoryPathData]);

  // Hook to fetch child categories based on selected path
  const { data: childCategoriesData, refetch: refetchChildCategories } =
    useGetChildCategoriesQuery(
      selectedPath[selectedPath.length - 1]?.id || "",
      {
        skip: selectedPath.length === 0, // Skip if no parent is selected
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    if (childCategoriesData?.data) {
      const mappedChildren = childCategoriesData.data.map((cat: any) => ({
        id: cat._id,
        categoryName: cat.categoryName,
        parent: cat.parent,
      }));
      // Only add new children if they are not already in dynamicCategories (e.g., from top-level)
      setDynamicCategories((prev) => {
        const newCategories = mappedChildren.filter(
          (newCat: Category) => !prev.some((cat) => cat.id === newCat.id)
        );
        return [...prev, ...newCategories];
      });
    }
  }, [childCategoriesData]);

  // Get top-level categories from RTK Query data
  const topLevelCategories = dynamicCategories.filter(
    (cat) => cat.parent === null
  );

  // Get child categories for a parent from dynamicCategories state
  const getChildCategories = (parentId: string) => {
    return dynamicCategories.filter((cat) => cat.parent === parentId);
  };

  // Handle category selection
  const handleSelect = (categoryId: string, level: number) => {
    const category = dynamicCategories.find((c) => c.id === categoryId);
    if (!category) return;

    const newPath = selectedPath.slice(0, level);
    newPath[level] = category;
    setSelectedPath(newPath);
    onChange(categoryId);

    // --- Log the exact last selected path/id/category AFTER the state update ---
    const lastSelectedCategory = newPath[newPath.length - 1];
    console.log("--- Category Selected ---");
    console.log("  Last Selected ID:", lastSelectedCategory?.id || "N/A");
    console.log("  Last Selected Category:", lastSelectedCategory || "N/A");
    console.log("  Full Selected Path:", newPath);
    console.log("-------------------------");
  };

  // Remove a selected category from the path
  const handleRemoveSelection = (level: number) => {
    const newPath = selectedPath.slice(0, level);
    setSelectedPath(newPath);

    // Update the form value to the new last category in the path, or empty string
    onChange(newPath[newPath.length - 1]?.id || "");
    toast.success("Selection cleared");
  };

  // Reset all selections
  const handleResetAll = () => {
    setSelectedPath([]);
    onChange("");
    toast.success("All selections cleared");
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    const parentId =
      selectedPath?.length > 0 ? (selectedPath[selectedPath.length - 1] as any).id : null;

      console.log("hit add category",selectedPath)
      // console.log("parent id as payload",parentId)

    try {
      const result = await addCategory({
        name: newCategoryName,
        parentId: parentId,
      }).unwrap();

      const newCategory: Category = {
        id: result.data._id,
        categoryName: result.data.categoryName,
        parent: result.data.parent,
      };

      setDynamicCategories((prev) => [...prev, newCategory]);

      if (selectedPath.length > 0) {
        handleSelect(newCategory.id, selectedPath.length);
      } else {
        setSelectedPath([newCategory]);
      }

      setNewCategoryName("");
      setIsCreatingCategory(false);
      toast.success(`"${newCategoryName}" created successfully`);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category.");
    }
  };

  // Get available categories for the current level
  const getAvailableCategories = (level: number) => {
    if (level === 0) return topLevelCategories;
    if (level > selectedPath.length) return [];
    const parentId = selectedPath[level - 1]?.id;
    return getChildCategories(parentId);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Breadcrumb navigation with clear options */}
      {selectedPath.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-600 flex-wrap">
            {selectedPath.map((cat, index) => (
              <div key={cat.id} className="flex items-center group">
                <span className="font-medium">{cat.categoryName}</span>{" "}
                {/* Use categoryName */}
                {index < selectedPath.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-1" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveSelection(index + 1)}
                  title="Remove this selection"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="text-red-500 hover:text-red-700"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Dynamic category selectors */}
      <div className="space-y-3 mt-2">
        {Array.from({ length: selectedPath.length + 1 }).map((_, level) => {
          const availableCategories = getAvailableCategories(level);
          const hasResults = availableCategories.length > 0;

          // Determine the currently selected category for this level in the path
          const currentSelectedCategory = selectedPath[level]?.id || "";

          // Decide whether to skip fetching for this level's dropdown
          const isFetchingSkipped = level > 0 && !selectedPath[level - 1]?.id;

          return (
            <div key={level} className="flex items-center gap-2">
              <Select
                value={currentSelectedCategory}
                onValueChange={(val) => handleSelect(val, level)}
                // Disable if no parent is selected for sub-levels
                disabled={isFetchingSkipped}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      level === 0 ? "Select a category" : "Select subcategory"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {hasResults ? (
                    availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.categoryName} {/* Use categoryName */}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 p-2">
                      No categories available
                    </div>
                  )}
                </SelectContent>
              </Select>

              {/* Add subcategory button */}
              {level === selectedPath.length && level > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingCategory(true)}
                  disabled={!selectedPath[level - 1]?.id} // Disable if no parent selected for new subcategory
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Subcategory
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Create new top-level category button */}
      {selectedPath.length === 0 && (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsCreatingCategory(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Create New Category
          </Button>
        </div>
      )}

      {/* Create category form */}
      {isCreatingCategory && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-2">
            {selectedPath.length > 0 ? "New Subcategory" : "New Category"}
          </h4>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              autoFocus
            />
            <Button onClick={handleCreateCategory}>Create</Button>
            <Button
              variant="outline"
              onClick={() => setIsCreatingCategory(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
