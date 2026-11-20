const WASH =
	'bg-[linear-gradient(115deg,color-mix(in_srgb,var(--color-orange-primary)_88%,transparent)_0%,color-mix(in_srgb,var(--color-orange-primary)_52%,transparent)_55%,rgba(20,8,3,0.5)_100%)]';

function TakeoverCover({ imageUrl }: { imageUrl: string | undefined }) {
	if (!imageUrl) return null;

	return (
		<>
			<img
				src={imageUrl}
				alt=""
				fetchPriority="low"
				decoding="async"
				className="absolute inset-0 size-full object-cover [scale:calc(1.12_-_var(--wipe,1)*0.12)]"
			/>
			<div className={`absolute inset-0 ${WASH}`} />
		</>
	);
}

export { TakeoverCover };
