import { FormGroup, FormControl } from "@angular/forms";
import { Project } from "./project.model";

export type ProjectFormValue = {
    name: string;
    status: Project['status'];
    owner: string;
    riskLevel: Project['riskLevel'];
    budget: number | null;
    startDate: string | null;
    endDate: string | null;
  };

export type ProjectFormGroup = FormGroup<{
    name: FormControl<string>;
    status: FormControl<Project['status']>;
    owner: FormControl<string>;
    riskLevel: FormControl<Project['riskLevel']>;
    budget: FormControl<number | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
  }>;
  
  