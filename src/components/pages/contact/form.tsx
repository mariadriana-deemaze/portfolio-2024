import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { LuArrowUpRight } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ContactResponse } from '@/server/routes/api/types/contact';
import { cn } from '@/utils/utils';

const contactSchema = z.object({
	name: z.string().min(1, 'Required.'),
	email: z.email('Invalid email.'),
	subject: z.string().min(1, 'Required.'),
	message: z.string().min(1, 'Required.'),
	website: z.string().trim().max(0, 'Invalid submission.')
});
type ContactFormValues = z.infer<typeof contactSchema>;

const LABEL_CLS =
	'font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground mb-[9px] transition-colors duration-[250ms] group-focus-within:text-[var(--color-orange-primary)]';
const FIELD_CLS =
	'h-auto rounded-[12px] bg-background border-border px-[15px] py-[13px] font-mono text-[14px] leading-[1.5] placeholder:text-muted-foreground/80 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[var(--color-orange-primary)] focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-orange-primary)_14%,transparent)] transition-[border-color,box-shadow] duration-[250ms]';

export const ContactForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting }
	} = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		mode: 'onChange',
		defaultValues: { website: '' }
	});

	const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
		const request = await fetch('/api/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		const response: ContactResponse = await request.json();

		if (!request.ok) {
			toast.error(response.message || 'Failed to send. Please try again.');
			return;
		}

		reset();
		toast.success("Sent! I'll get back to you soon.");
	};

	return (
		<form className="flex flex-col gap-[22px]" onSubmit={handleSubmit(onSubmit)}>
			<div
				className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
				aria-hidden="true"
			>
				<Label htmlFor="website-input">Website</Label>
				<Input
					id="website-input"
					type="text"
					tabIndex={-1}
					autoComplete="off"
					{...register('website')}
				/>
			</div>

			<div className="grid grid-cols-1 min-[520px]:grid-cols-2 gap-[22px]">
				<div className="group flex flex-col">
					<Label htmlFor="name-input" className={LABEL_CLS}>
						Your name
					</Label>
					<Input
						id="name-input"
						type="text"
						placeholder="Jane Doe"
						className={FIELD_CLS}
						{...register('name')}
					/>
					{errors.name && (
						<span className="mt-[6px] font-mono text-[11px] text-destructive">
							{errors.name.message}
						</span>
					)}
				</div>

				<div className="group flex flex-col">
					<Label htmlFor="email-input" className={LABEL_CLS}>
						Email
					</Label>
					<Input
						id="email-input"
						type="email"
						placeholder="jane@email.com"
						className={FIELD_CLS}
						{...register('email')}
					/>
					{errors.email && (
						<span className="mt-[6px] font-mono text-[11px] text-destructive">
							{errors.email.message}
						</span>
					)}
				</div>
			</div>

			<div className="group flex flex-col">
				<Label htmlFor="subject-input" className={LABEL_CLS}>
					Subject
				</Label>
				<Input
					id="subject-input"
					type="text"
					placeholder="What's this about?"
					className={FIELD_CLS}
					{...register('subject')}
				/>
				{errors.subject && (
					<span className="mt-[6px] font-mono text-[11px] text-destructive">
						{errors.subject.message}
					</span>
				)}
			</div>

			<div className="group flex flex-col">
				<Label htmlFor="message-input" className={LABEL_CLS}>
					Message
				</Label>
				<Textarea
					id="message-input"
					placeholder="Tell me a little about it…"
					className={cn(FIELD_CLS, 'min-h-[132px] resize-vertical leading-[1.6]')}
					{...register('message')}
				/>
				{errors.message && (
					<span className="mt-[6px] font-mono text-[11px] text-destructive">
						{errors.message.message}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-[10px]">
				<Button
					type="submit"
					variant="ghost"
					disabled={!isValid || isSubmitting}
					className="self-start rounded-full px-6 h-auto py-[14px] gap-[11px] bg-[var(--color-orange-primary)] text-white hover:bg-[var(--color-orange-primary)] hover:text-white hover:-translate-y-[3px] hover:shadow-[0_18px_34px_-12px_color-mix(in_srgb,var(--color-orange-primary)_60%,transparent)] font-mono text-[14px] disabled:opacity-40 transition-[translate,box-shadow] duration-[400ms] [transition-timing-function:var(--ease-out)]"
				>
					{isSubmitting ? 'Sending…' : 'Send message'}
					<LuArrowUpRight className="w-4 h-4" aria-hidden="true" />
				</Button>
				<p className="m-0 font-mono text-[11px] text-muted-foreground">
					Or just email me directly — whatever's easier.
				</p>
			</div>
		</form>
	);
};
