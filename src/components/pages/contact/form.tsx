import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { LuArrowUpRight } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/contexts/locale-context';
import { CONTACT_FIELD_MAX, type ContactResponse } from '@/server/routes/api/types/contact';
import type { TranslationKey } from '@/translations/types';

function createContactSchema(t: (key: TranslationKey) => string) {
	return z.object({
		name: z
			.string()
			.min(1, t('validation.required'))
			.max(CONTACT_FIELD_MAX.name, t('validation.too-long')),
		email: z
			.email(t('validation.invalid-email'))
			.max(CONTACT_FIELD_MAX.email, t('validation.too-long')),
		subject: z
			.string()
			.min(1, t('validation.required'))
			.max(CONTACT_FIELD_MAX.subject, t('validation.too-long')),
		message: z
			.string()
			.min(1, t('validation.required'))
			.max(CONTACT_FIELD_MAX.message, t('validation.too-long')),
		website: z.string().trim().max(0, 'Invalid submission.')
	});
}
type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

export const ContactForm = () => {
	const { t } = useLocale();
	const contactSchema = useMemo(() => createContactSchema(t), [t]);
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
			toast.error(response.message || t('pages.contact.form.toast.error'));
			return;
		}

		reset();
		toast.success(t('pages.contact.form.toast.success'));
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
					<Label htmlFor="name-input">{t('pages.contact.form.name.label')}</Label>
					<Input
						id="name-input"
						type="text"
						placeholder={t('pages.contact.form.name.placeholder')}
						error={errors.name?.message}
						{...register('name')}
					/>
				</div>

				<div className="group flex flex-col">
					<Label htmlFor="email-input">{t('pages.contact.form.email.label')}</Label>
					<Input
						id="email-input"
						type="email"
						placeholder={t('pages.contact.form.email.placeholder')}
						error={errors.email?.message}
						{...register('email')}
					/>
				</div>
			</div>

			<div className="group flex flex-col">
				<Label htmlFor="subject-input">{t('pages.contact.form.subject.label')}</Label>
				<Input
					id="subject-input"
					type="text"
					placeholder={t('pages.contact.form.subject.placeholder')}
					error={errors.subject?.message}
					{...register('subject')}
				/>
			</div>

			<div className="group flex flex-col">
				<Label htmlFor="message-input">{t('pages.contact.form.message.label')}</Label>
				<Textarea
					id="message-input"
					placeholder={t('pages.contact.form.message.placeholder')}
					error={errors.message?.message}
					{...register('message')}
				/>
			</div>

			<div className="flex flex-col gap-[10px]">
				<Button
					type="submit"
					variant="ghost"
					disabled={!isValid || isSubmitting}
					className="self-start rounded-full px-6 h-auto py-[14px] gap-[11px] bg-[var(--color-orange-primary)] text-white hover:bg-[var(--color-orange-primary)] hover:text-white hover:-translate-y-[3px] hover:shadow-[0_18px_34px_-12px_color-mix(in_srgb,var(--color-orange-primary)_60%,transparent)] font-mono text-[14px] disabled:opacity-40 transition-[translate,box-shadow] duration-[400ms] [transition-timing-function:var(--ease-out)]"
				>
					{isSubmitting ? t('pages.contact.form.submitting') : t('pages.contact.form.submit')}
					<LuArrowUpRight className="w-4 h-4" aria-hidden="true" />
				</Button>
				<p className="m-0 font-mono text-[11px] text-muted-foreground">
					{t('pages.contact.form.email-fallback')}
				</p>
			</div>
		</form>
	);
};
