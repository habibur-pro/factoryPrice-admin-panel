import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type TopProduct = {
  name: string;
  category: string;
  sold: number;
  total: number;
  percentage: number;
};

type TopSellingProductsProps = {
  products: TopProduct[];
  className?: string;
};

const TopSellingProducts = ({
  products,
  className,
}: TopSellingProductsProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.name}>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{product.sold} sold</p>
                  <p className="text-xs text-muted-foreground">
                    {product.percentage}% of inventory
                  </p>
                </div>
              </div>
              <Progress value={product.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default TopSellingProducts;
