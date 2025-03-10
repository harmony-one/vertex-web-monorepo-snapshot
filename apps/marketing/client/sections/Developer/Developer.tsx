import classNames from 'classnames';
import { HeaderCard } from 'client/components/HeaderCard';
import {
  DEFAULT_SECTION_GAP,
  DEFAULT_SECTION_PADDING,
  DEFAULT_SECTION_WIDTH,
  SECTION_IDS,
} from 'client/consts';
import { DeveloperCard } from './components/DeveloperCard';
import { DEVELOPER_CARDS } from './data';

export function Developer() {
  return (
    <section
      className={classNames(
        'flex scroll-m-10 flex-col',
        DEFAULT_SECTION_PADDING,
        DEFAULT_SECTION_GAP,
        DEFAULT_SECTION_WIDTH,
      )}
      id={SECTION_IDS.developers}
    >
      <HeaderCard
        title="Developers"
        heading={
          <div className="leading-tight">
            <p>Get an Edge.</p>
            <p>Give an Edge.</p>
          </div>
        }
        content={
          <div className="flex flex-col gap-y-2 md:gap-px">
            <p>
              Tap into a turbo-charged orderbook and trading engine on Arbitrum.
            </p>
            <p>
              Build user-focused products and front-ends on top of Vertex&apos;s
              powerful architecture.
            </p>
          </div>
        }
        className="px-0 md:w-4/5"
        headingClassNames="md:w-4/5"
        contentClassNames="w-full sm:w-4/5 lg:w-full pt-2"
      />
      <div
        className={classNames(
          'flex flex-col items-center gap-y-4',
          'md:flex-row md:gap-x-4',
          'lg:gap-y-0',
        )}
      >
        {DEVELOPER_CARDS.map((card) => (
          <DeveloperCard
            {...card}
            key={card.title}
            comingSoon={card.comingSoon}
          />
        ))}
      </div>
    </section>
  );
}
