import z, { SafeParseReturnType } from 'zod';

// Esquema para la Información del Presupuesto
const BudgetInformationSchema = z.object({
  certificateNumber: z.string({
    required_error: 'El número de certificado es obligatorio',
    invalid_type_error: 'El número de certificado debe ser una cadena de texto',
  }),
  issuanceDate: z
    .string({
      required_error: 'La fecha de expedición es obligatoria',
      invalid_type_error: 'La fecha de expedición debe ser una cadena de texto',
    })
    .date(),

  totalAssignedAmount: z
    .number({
      required_error: 'El monto total asignado es obligatorio',
      invalid_type_error: 'El monto total asignado debe ser un número',
    })
    .positive({ message: 'El monto total asignado debe ser un número positivo' }),

  rubros: z
    .array(
      z.object({
        name: z.string({
          required_error: 'El nombre del rubro es obligatorio',
          invalid_type_error: 'El nombre del rubro debe ser una cadena de texto',
        }),
        code: z.string({
          required_error: 'El código del rubro es obligatorio',
          invalid_type_error: 'El código del rubro debe ser una cadena de texto',
        }),
        assignedAmount: z
          .number({
            required_error: 'El monto asignado al rubro es obligatorio',
            invalid_type_error: 'El monto asignado al rubro debe ser un número',
          })
          .positive({ message: 'El monto asignado al rubro debe ser un número positivo' }),
      })
    )
    .nonempty({ message: 'El arreglo de rubros no puede estar vacío' }),
});

// Funciones de validación para la información presupuestaria
export function validateBudgetInformation(data: unknown): SafeParseReturnType<unknown, z.infer<typeof BudgetInformationSchema>> {
  return BudgetInformationSchema.strict().safeParse(data);
}
