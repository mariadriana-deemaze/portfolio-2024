import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface TakeoverTarget {
	slug: string;
	imageUrl: string | undefined;
}

type TakeoverPhase = 'covering' | 'revealing';

interface Takeover {
	target: TakeoverTarget;
	phase: TakeoverPhase;
}

interface TakeoverContextValue {
	takeover: Takeover | null;
	begin: (target: TakeoverTarget) => void;
	arrive: (slug: string) => void;
	clear: () => void;
}

const TakeoverContext = createContext<TakeoverContextValue | null>(null);

function TakeoverProvider({ children }: { children: ReactNode }) {
	const [takeover, setTakeover] = useState<Takeover | null>(null);

	const begin = useCallback((target: TakeoverTarget) => {
		setTakeover({ target, phase: 'covering' });
	}, []);

	const arrive = useCallback((slug: string) => {
		setTakeover((current) =>
			current?.target.slug === slug && current.phase === 'covering'
				? { ...current, phase: 'revealing' }
				: current
		);
	}, []);

	const clear = useCallback(() => setTakeover(null), []);

	const value = useMemo(
		() => ({ takeover, begin, arrive, clear }),
		[takeover, begin, arrive, clear]
	);

	return <TakeoverContext.Provider value={value}>{children}</TakeoverContext.Provider>;
}

function useTakeover(): TakeoverContextValue {
	const ctx = useContext(TakeoverContext);
	if (!ctx) throw new Error('useTakeover must be used within TakeoverProvider');
	return ctx;
}

function useTakeoverArrival(slug: string) {
	const { arrive } = useTakeover();

	useEffect(() => {
		arrive(slug);
	}, [slug, arrive]);
}

export { TakeoverProvider, useTakeover, useTakeoverArrival };
