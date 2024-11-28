import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

interface SimpleMetricsCardProps {
  label: string;
  value: string | number;
}

export function SimpleMetricsCard({ label, value }: SimpleMetricsCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center text-2xl font-bold">
        {value}
      </CardContent>
    </Card>
  );
}
