"use client";

import React, { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { userSettingsSchema } from "@/app/utils/zodSchemas";
import { updateUserProfile } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/custom/SubmitButtons";
import { Card, CardContent } from "../ui/card";

interface SettingsFormProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [lastResult, action] = useActionState(updateUserProfile, undefined);

  const [form, fields] = useForm({
    defaultValue: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
    },
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: userSettingsSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Card className="w-sm max-w-sm">
      <CardContent className="p-6">
        <form
          id={form.id}
          action={action}
          onSubmit={form.onSubmit}
          noValidate
          className="grid gap-6 max-w-md mx-auto"
        >
          <input type="hidden" name="id" value={user.id} />

          <div className="space-y-1">
            <Label htmlFor={fields.firstName.name}>First Name</Label>
            <Input
              name={fields.firstName.name}
              key={fields.firstName.key}
              defaultValue={user.firstName}
              placeholder="John"
            />
            <p className="text-sm text-red-500">{fields.firstName.errors}</p>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.lastName.name}>Last Name</Label>
            <Input
              name={fields.lastName.name}
              key={fields.lastName.key}
              defaultValue={user.lastName}
              placeholder="Doe"
            />
            <p className="text-sm text-red-500">{fields.lastName.errors}</p>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.address.name}>Address</Label>
            <Input
              name={fields.address.name}
              key={fields.address.key}
              defaultValue={user.address}
              placeholder="123 Main Street"
            />
            <p className="text-sm text-red-500">{fields.address.errors}</p>
          </div>

          <div className="flex justify-end">
            <SubmitButton text="Save Changes" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
