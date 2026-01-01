"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl } from "./ui/form";
import { Input } from "./ui/input";
import { useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const formSchema = z.object({
	mesas: z.array(
		z.object({
			pedido: z
				.string()
				.max(30, "El pedido no puede superar los 30 caracteres"),
		})
	),
});

type UserType = z.infer<typeof formSchema>;

const MyForm = () => {
	const form = useForm<UserType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mesas: [{ pedido: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "mesas",
	});

	const pedidos = useWatch({
		control: form.control,
		name: "mesas",
	});

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		const lastIndex = pedidos.length - 1;
		const lastPedido = pedidos[lastIndex]?.pedido;
		const prevPedido = pedidos[lastIndex - 1]?.pedido;

		// Generate
		if (lastPedido && lastPedido.trim() !== "") {
			append({ pedido: "" });
			return;
		}

		// Remove
		if (pedidos.length > 1 && lastPedido === "" && prevPedido === "") {
			remove(lastIndex);
		}
	}, [pedidos, append, remove]);

	const onSubmit = async (data: UserType) => {
		try {
			const pedidosValidos = data.mesas
				.map((m) => m.pedido.trim())
				.filter((p) => p.length > 0);
			console.log(`${API_URL}/printer/print`);
			const content = pedidosValidos.join("\n");
			const res = await fetch(`${API_URL}/printer/print`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			});

			if (!res.ok) {
				throw new Error("Error al enviar los datos");
			}

			const result = await res.json();
			console.log("Datos enviados con éxito:", result);
			form.reset();
		} catch (error) {
			form.reset();
			form.setError("root", {
				type: "server",
				message: "No se pudo enviar el pedido. Intenta nuevamente.",
			});
		}
	};

	const normalizePedido = (value: string) => {
		const trimmed = value.trimStart();

		if (trimmed === "") return "";

		if (/^\d+\s/.test(trimmed)) return trimmed;

		return `1 ${trimmed}`;
	};

	return (
		<div className="form-container">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					{fields.map((fields, index) => (
						<Controller
							key={fields.id}
							name={`mesas.${index}.pedido`}
							control={form.control}
							render={({ field }) => (
								<FormControl>
									<Input
										type="text"
										{...field}
										className="py-5 my-3"
										placeholder={`Pedido ${index + 1}`}
										id={`pedido-${index}`}
										ref={(el) => {
											inputRefs.current[index] = el;
										}}
										onChange={(e) => {
											form.clearErrors("root");

											const value = e.target.value;

											// 👇 permitir borrar y editar libremente
											field.onChange(value);

											// 👇 normalizar SOLO si empieza con letra
											if (/^[a-zA-Z]/.test(value)) {
												field.onChange(normalizePedido(value));
											}
										}}
									/>
								</FormControl>
							)}
						></Controller>
					))}
					{form.formState.errors.root && (
						<p className="text-red-500 text-sm mt-2">
							{form.formState.errors.root.message}
						</p>
					)}
					<Button type="submit" className="p-7 my-2 w-full">
						Enviar
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default MyForm;
