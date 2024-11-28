import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { ExternalServicesRepositoriesCountDAO } from "@server/domain/dao/externalServicesRepositoriesCount";

interface ExternalClassUsageCountProps {
  className?: string;
  externalServicesRepositoriesCount: ExternalServicesRepositoriesCountDAO;
}

export function ExternalClassUsageCountTable({
  className,
  externalServicesRepositoriesCount,
}: ExternalClassUsageCountProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>External Repositories/Services by Module</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {externalServicesRepositoriesCount.map(({ externalModule, externalClass, count }) => (
              <TableRow key={externalClass} className="text-left">
                <TableCell>{externalModule}</TableCell>
                <TableCell>{externalClass}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
