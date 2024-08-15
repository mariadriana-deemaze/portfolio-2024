'use client';

import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactInfo, ContactResponse } from '../api/send/route';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { clashDisplay } from '../layout';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { REGEX_EMAIL } from '@/utils/regex';

export default function Page() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ContactInfo>();

	const formHasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

	const onSubmit: SubmitHandler<ContactInfo> = async (data) => {
		if (!formHasErrors) {
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
		}

		toast.error('Cannot submit. Form has errors.');
	};

	return (
		<div className="flex flex-col justify-center items-center mt-20">
			<div className="flex flex-col items-center align-middle self-center max-w-md w-full gap-10">
				<div className="flex flex-col w-full gap-4">
					<h2 className={`${clashDisplay.className} text-xl font-bold`}>Reach out</h2>
					<p className="text-pretty font-mono text-sm text-foreground leading-5">
						I'm always interested in new projects and opportunities. Feel free to get in
						touch with me if you have a project in mind, want to discuss a potential
						collaboration, or simply want to say hello. You can reach me through the
						contact form below.
						<br />I typically respond back to emails within{' '}
						<span className="text-orange-600">1 business day</span>.
					</p>
				</div>

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

					<Button type="submit">Submit</Button>
				</form>
			</div>
			<Toaster />
		</div>
	);
}
