import z, { SafeParseReturnType } from 'zod';

// Esquema para la Información del Presupuesto
const BudgetInformationSchema = z.object({
  certificateNumber: z.string({
    required_error: 'Certificate number is required',
    invalid_type_error: 'Certificate number must be a string',
  }),
  issuanceDate: z
    .string({
      required_error: 'Issuance date is required',
      invalid_type_error: 'Issuance date must be a string',
    })
    .date(),

  totalAssignedAmount: z
    .number({
      required_error: 'Total assigned amount is required',
      invalid_type_error: 'Total assigned amount must be a number',
    })
    .positive({ message: 'Total assigned amount must be a positive number' }),

  rubros: z
    .array(
      z.object({
        name: z.string({
          required_error: 'Rubro name is required',
          invalid_type_error: 'Rubro name must be a string',
        }),
        code: z.string({
          required_error: 'Rubro code is required',
          invalid_type_error: 'Rubro code must be a string',
        }),
        assignedAmount: z
          .number({
            required_error: 'Assigned amount for rubro is required',
          })
          .positive({ message: 'Assigned amount for rubro must be a positive number' }),
      })
    )
    .nonempty({ message: 'Rubros array cannot be empty' }),
});

// Funciones de validación para la información presupuestaria
export function validateBudgetInformation(data: unknown): SafeParseReturnType<unknown, z.infer<typeof BudgetInformationSchema>> {
  return BudgetInformationSchema.strict().safeParse(data);
}
