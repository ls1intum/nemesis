"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useRouter } from "next/navigation";

interface ModuleSelectProps {
  selectedModule: string;
  modules: string[];
}

export function ModuleSelect({ selectedModule, modules }: ModuleSelectProps) {
  const router = useRouter();

  const handleItemClick = (newModule: string) => {
    const params = new URLSearchParams();
    params.set("module", newModule);
    router.push(`/?${params.toString()}`);
  };

  return (
    <Select defaultValue={selectedModule} onValueChange={(value) => handleItemClick(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a module" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Module</SelectLabel>
          {modules.map((module) => (
            <SelectItem key={module} value={module}>
              {module[0].toUpperCase() + module.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
