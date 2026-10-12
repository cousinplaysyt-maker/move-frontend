import { useState } from 'react'
import {
  MdSearch,
  MdTune,
  MdLocalFireDepartment,
  MdArrowForward,
  MdChevronRight,
  MdStar,
  MdLocationOn,
  MdSchedule,
  MdHandshake,
} from 'react-icons/md'
import { sports, actions, courts, sessions } from '../data/mock'

function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h3 className="text-headline-md md:text-headline-lg text-on-surface">{title}</h3>
        <p className="text-body-sm md:text-body-md text-secondary">{subtitle}</p>
      </div>
      {right}
    </div>
  )
}

export default function Discover() {
  const [activeSport, setActiveSport] = useState('Pickleball')
  const visibleCourts = courts.filter((c) => c.sports.includes(activeSport))

  return (
    <div className="px-4 md:px-8 pt-4 md:pt-8 flex flex-col gap-8 md:gap-10">
      {/* Search + sport chips */}
      <section className="flex flex-col gap-4">
        <div className="relative flex items-center md:max-w-2xl">
          <MdSearch className="absolute left-4 text-primary text-[20px] pointer-events-none" />
          <input
            type="text"
            placeholder="Search courts, clubs, or matches..."
            className="w-full pl-11 pr-14 py-3 bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button aria-label="Filter options" className="absolute right-1.5 h-9 w-9 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant">
            <MdTune className="text-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 md:flex-wrap md:overflow-visible">
          {sports.map((s) => {
            const active = s.name === activeSport
            return (
              <button
                key={s.name}
                onClick={() => setActiveSport(s.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-label-md shrink-0 transition-all active:scale-95 ${
                  active
                    ? 'bg-primary text-on-primary shadow-[0_4px_14px_0_rgba(0,105,72,0.35)]'
                    : 'bg-surface-container-lowest text-secondary shadow-sm hover:bg-surface-container-low'
                }`}
              >
                <span className="text-sm">{s.emoji}</span>
                <span>{s.name}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed ml-0.5" />}
              </button>
            )
          })}
        </div>
      </section>

      {/* Hero */}
      <section>
        <div className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-md grid md:grid-cols-2">
          <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center gap-3 md:gap-4 order-2 md:order-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm bg-primary-container text-on-primary-container">
                <MdLocalFireDepartment className="text-[14px]" />
                CEBU WEEKEND SHOWDOWN
              </span>
              <span className="text-label-sm text-secondary">40+ Matches</span>
            </div>
            <h2 className="text-headline-lg-mobile md:text-display text-on-surface">
              Open Play Weekend in Cebu
            </h2>
            <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-md">
              Pickleball, padel &amp; basketball runs forming fast across Metro Cebu. Join solo or with a partner.
            </p>
            <div className="mt-2">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary text-label-lg shadow-[0_4px_14px_0_rgba(0,105,72,0.35)] hover:bg-primary-container active:scale-95 transition-all">
                Browse Matches <MdArrowForward className="text-[18px]" />
              </button>
            </div>
          </div>
          <div className="relative h-52 md:h-auto md:min-h-[320px] order-1 md:order-2 bg-surface-container">
            <img
              src={courts[0].img}
              alt="Pickleball players on an outdoor court"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface-container-lowest/70 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {actions.map(({ label, Icon, bg }) => (
          <button
            key={label}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 md:p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-low active:scale-95 transition-all"
          >
            <span className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm shrink-0 ${bg}`}>
              <Icon className="text-[22px]" />
            </span>
            <span className="text-label-lg text-on-surface">{label}</span>
          </button>
        ))}
      </section>

      {/* Popular courts */}
      <section>
        <SectionHeader
          title="Popular Courts in Cebu"
          subtitle="Verified clubs with instant court locking"
          right={
            <button className="text-label-md text-primary flex items-center gap-0.5 hover:text-primary-container">
              See all <MdChevronRight className="text-base" />
            </button>
          }
        />

        {visibleCourts.length === 0 ? (
          <p className="text-body-md text-secondary bg-surface-container-lowest rounded-2xl p-6">
            No {activeSport} courts yet. Try another sport.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
            {visibleCourts.map((c) => (
              <article
                key={c.id}
                className="w-72 md:w-auto shrink-0 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative h-40 md:h-48 w-full bg-surface-container">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-label-sm bg-surface-container-lowest/90 text-on-surface backdrop-blur-md">
                    {c.type}
                  </span>
                  <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-label-sm bg-surface-container-lowest/90 text-tertiary backdrop-blur-md">
                    <MdStar className="text-[13px] text-tertiary-container" />
                    {c.rating}
                  </span>
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white text-label-sm">
                    <MdLocationOn className="text-[14px]" />
                    <span>{c.place}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                  <div>
                    <h4 className="text-headline-sm text-on-surface truncate">{c.name}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {c.sports.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm">
                          {s}
                        </span>
                      ))}
                      <span className="text-secondary text-label-sm ml-auto">{c.count} Courts</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-headline-sm text-primary font-bold">₱{c.price}</span>
                      <span className="text-body-sm text-secondary">/hr</span>
                    </div>
                    <button className="px-4 py-2 rounded-full bg-primary text-on-primary text-label-md shadow-sm hover:bg-primary-container active:scale-95 transition-all">
                      Book Slot
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Open sessions */}
      <section>
        <SectionHeader
          title="Trending Open Sessions"
          subtitle="Spots filling live in your neighborhood"
          right={
            <span className="flex h-2.5 w-2.5 relative mb-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <article
              key={s.id}
              className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-md shrink-0 shadow-sm ${s.avatar}`}>
                    {s.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-label-md text-on-surface truncate">Hosted by {s.host}</span>
                      <span className={`px-1.5 rounded text-[10px] font-bold ${s.tagBg}`}>{s.tag}</span>
                    </div>
                    <p className="text-body-sm text-secondary truncate">{s.venue}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-label-sm shrink-0 ${s.levelBg}`}>{s.level}</span>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <MdSchedule className="text-primary text-[18px]" />
                  <span className="text-label-md text-on-surface">{s.time}</span>
                </div>
                <span className={`text-label-md font-bold ${s.spotsColor}`}>{s.spots}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-body-sm text-secondary">Split fee:</span>
                  <span className="text-label-md text-on-surface font-bold">₱{s.fee}</span>
                  <span className="text-body-sm text-secondary">/person</span>
                </div>
                <button className="px-4 py-2 rounded-full bg-primary text-on-primary text-label-md shadow-[0_4px_14px_0_rgba(0,105,72,0.3)] hover:bg-primary-container active:scale-95 transition-all">
                  {s.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Partner CTA */}
      <section>
        <div className="rounded-2xl p-5 md:p-6 bg-gradient-to-r from-surface-container to-surface-container-high flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
              <MdHandshake className="text-[22px]" />
            </div>
            <div>
              <h5 className="text-label-lg md:text-headline-sm text-on-surface">Need a game partner?</h5>
              <p className="text-body-sm md:text-body-md text-secondary">
                Match with local players matching your exact DUPR rank.
              </p>
            </div>
          </div>
          <button aria-label="Find a partner" className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm shrink-0 hover:bg-primary hover:text-on-primary transition-colors active:scale-95">
            <MdArrowForward className="text-[18px]" />
          </button>
        </div>
      </section>
    </div>
  )
}