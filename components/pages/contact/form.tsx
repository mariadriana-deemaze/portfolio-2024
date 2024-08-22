'use client';

import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { REGEX_EMAIL } from '@/utils/regex';
import { ContactInfo, ContactResponse } from '@/types/contact';

export const ContactForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting }
	} = useForm<ContactInfo>();

	const onSubmit: SubmitHandler<ContactInfo> = async (data) => {
		if (!isValid) {
			toast.error('Cannot submit. Form has errors.');
			return;
		}

		const request = await fetch('api/send', {
			method: 'POST',
			body: JSON.stringify(data)
		});

		const response: ContactResponse = await request.json();

		if (!response.data) {
			console.log(response);
			toast.error(response.message);
			return;
		}

		toast.success('Submitted with sucess. Will get in touch soon.');
	};

	return (
		<form className="flex flex-col w-full gap-4" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-2 w-full">
				<Label htmlFor="name-input">Name</Label>
				<Input
					id="name-input"
					className="form-input"
					{...register('name', { required: 'Required field.' })}
				/>
				{errors.name && <span>{errors.name.message}</span>}
			</div>

			<div className="flex flex-col gap-2 w-full">
				<Label htmlFor="email-input">E-mail</Label>
				<Input
					id="email-input"
					className="form-input"
					{...register('email', {
						required: 'Required field.',
						pattern: {
							value: REGEX_EMAIL,
							message: 'Invalid e-mail.'
						}
					})}
				/>
				{errors.email && <span>{errors.email.message}</span>}
			</div>

			<div className="flex flex-col gap-2 w-full">
				<Label htmlFor="subject-input">Subject</Label>
				<Input
					id="subject-input"
					className="form-input"
					{...register('subject', { required: 'Required field.' })}
				/>
				{errors.subject && <span>{errors.subject.message}</span>}
			</div>

			<div className="flex flex-col gap-2 w-full">
				<Label htmlFor="message-input">Message</Label>
				<Textarea
					id="message-input"
					className="form-input"
					{...register('message', { required: 'Required field.' })}
				/>
				{errors.message && <span>{errors.message.message}</span>}
			</div>

			<Button type="submit" disabled={!isValid || isSubmitting}>
				Submit
			</Button>
			<Toaster />
		</form>
	);
};
