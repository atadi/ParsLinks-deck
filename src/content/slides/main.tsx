"use client"

import { CT } from "@/content/edit"
import {
  Callout,
  Compare,
  LayerStack,
  Lede,
  OppMap,
  Phase,
  Questions,
  Scenario,
  SlideHead,
  Split,
  Statement,
  Timeline,
} from "@/components/kit"

/* ==================================================================
   MAIN DECK — ParsLinks × نوین هاست
   All audience-visible copy lives in src/content/presentation.json.
   Slides compose layout primitives + <CT k="..."/> content keys only.
   ================================================================== */

/* ---------------- 02 · Complementary capabilities (opening slide) ---------------- */

const INFRA_ITEMS = [
  "together.infra.compute",
  "together.infra.network",
  "together.infra.storage",
  "together.infra.capacity",
  "together.infra.operations",
  "together.infra.customers",
  "together.infra.market",
  "together.infra.experience",
] as const

const SOFT_ITEMS = [
  "together.soft.softwareEng",
  "together.soft.productEng",
  "together.soft.controlPlane",
  "together.soft.automation",
  "together.soft.apiDesign",
  "together.soft.dx",
  "together.soft.observability",
  "together.soft.aiIntegration",
] as const

export function CapabilitiesSplit() {
  return (
    <>
      <SlideHead eyebrow={<CT k="together.eyebrow" />} title={<CT k="together.title" rich />} />
      <Split
        left={{
          brand: <CT k="together.infra.brand" />,
          side: "infra",
          items: INFRA_ITEMS.map((k) => <CT key={k} k={k} />),
        }}
        right={{
          brand: <CT k="together.soft.brand" />,
          side: "soft",
          items: SOFT_ITEMS.map((k) => <CT key={k} k={k} />),
        }}
      />
      <Callout center>
        <CT k="together.callout" />
      </Callout>
    </>
  )
}

/* ---------------- 03 · From infrastructure to products ---------------- */

const AFTER_ITEMS = [
  "shift.after.deployApp",
  "shift.after.postgres",
  "shift.after.redis",
  "shift.after.objectStorage",
  "shift.after.devPlatform",
  "shift.after.aiWorkloads",
  "shift.after.oneClick",
  "shift.after.apiAutomation",
] as const

export function InfraToProducts() {
  return (
    <>
      <SlideHead eyebrow={<CT k="shift.eyebrow" />} title={<CT k="shift.title" rich />} />
      <Compare
        before={{
          title: <CT k="shift.beforeTitle" />,
          items: ["CPU", "RAM", "Disk", "Bandwidth", "VM / VPS", "Dedicated"],
        }}
        after={{ title: <CT k="shift.afterTitle" />, items: AFTER_ITEMS.map((k) => <CT key={k} k={k} />) }}
      />
      <Lede muted>
        <CT k="shift.lede" />
      </Lede>
    </>
  )
}

/* ---------------- 04 · The opportunity (outcome message) ---------------- */

export function OpportunityMsg() {
  return (
    <>
      <Phase n={<CT k="opportunity.phaseN" />} label={<CT k="opportunity.phase" />} />
      <Statement center lead={<CT k="opportunity.lead" rich />} sub={<CT k="opportunity.sub" />} />
    </>
  )
}

/* ---------------- 05 · Opportunity map ---------------- */

const FAMILIES: { name: string; items: readonly string[] }[] = [
  {
    name: "oppmap.appPlatform.name",
    items: [
      "oppmap.appPlatform.gitDeploy",
      "oppmap.appPlatform.hosting",
      "oppmap.appPlatform.services",
      "oppmap.appPlatform.domains",
      "oppmap.appPlatform.workflows",
    ],
  },
  {
    name: "oppmap.managedData.name",
    items: ["oppmap.managedData.postgresql", "oppmap.managedData.redis", "oppmap.managedData.objectStorage", "oppmap.managedData.backup"],
  },
  {
    name: "oppmap.devCloud.name",
    items: ["oppmap.devCloud.api", "oppmap.devCloud.cli", "oppmap.devCloud.automation", "oppmap.devCloud.runtimes"],
  },
  {
    name: "oppmap.enterprise.name",
    items: ["oppmap.enterprise.platforms", "oppmap.enterprise.environments", "oppmap.enterprise.deployments"],
  },
  {
    name: "oppmap.aiInfra.name",
    items: ["oppmap.aiInfra.gpu", "oppmap.aiInfra.inference", "oppmap.aiInfra.gateway", "oppmap.aiInfra.routing", "oppmap.aiInfra.metering"],
  },
  {
    name: "oppmap.marketplace.name",
    items: ["oppmap.marketplace.wordpress", "oppmap.marketplace.n8n", "oppmap.marketplace.gitlab", "oppmap.marketplace.templates"],
  },
]

export function OpportunityMap() {
  return (
    <>
      <SlideHead eyebrow={<CT k="oppmap.eyebrow" />} title={<CT k="oppmap.title" rich />} />
      <OppMap
        families={FAMILIES.map((f) => ({
          name: <CT key={f.name} k={f.name as "oppmap.appPlatform.name"} />,
          items: f.items.map((k) => <CT key={k} k={k as "oppmap.appPlatform.gitDeploy"} />),
        }))}
      />
      <Lede muted>
        <CT k="oppmap.lede" />
      </Lede>
    </>
  )
}

/* ---------------- 06 · Layered architecture (bridge) ---------------- */

const LAYERS: { k: string; tone: "cust" | "prod" | "soft" | "infra" }[] = [
  { k: "layers.customers.label", tone: "cust" },
  { k: "layers.products.label", tone: "prod" },
  { k: "layers.software.label", tone: "soft" },
  { k: "layers.controlPlane.label", tone: "soft" },
  { k: "layers.infra.label", tone: "infra" },
  { k: "layers.infraMeta.label", tone: "infra" },
]

export function LayeredDiagram() {
  return (
    <>
      <SlideHead eyebrow={<CT k="layers.eyebrow" />} title={<CT k="layers.title" rich />} />
      <LayerStack
        layers={LAYERS.map((l) => ({
          tone: l.tone,
          label: <CT key={l.k} k={l.k as "layers.customers.label"} />,
        }))}
      />
    </>
  )
}

/* ---------------- 07 · Joint use-case scenarios ---------------- */

const SCENARIOS: { titleK: string; steps: string[] }[] = [
  { titleK: "scenarios.startup.title", steps: ["Git", "Deploy", "Database", "Domain"] },
  { titleK: "scenarios.data.title", steps: ["PostgreSQL", "Redis", "Storage", "Backup"] },
  { titleK: "scenarios.enterprise.title", steps: ["Dedicated infra", "Software layer", "Isolated workloads"] },
  { titleK: "scenarios.ai.title", steps: ["Compute / GPU", "Inference", "AI Gateway", "Metering"] },
]

export function Scenarios() {
  return (
    <>
      <SlideHead eyebrow={<CT k="scenarios.eyebrow" />} title={<CT k="scenarios.title" rich />} />
      <div className="scenarios">
        {SCENARIOS.map((s, i) => (
          <Scenario key={i} title={<CT k={s.titleK as "scenarios.startup.title"} />} steps={s.steps} />
        ))}
      </div>
    </>
  )
}

/* ---------------- 08 · Existing technology foundation ---------------- */

const FOUNDATION_CHIPS = [
  "foundation.chips.projects",
  "foundation.chips.gitDeploy",
  "foundation.chips.environments",
  "foundation.chips.managedServices",
  "foundation.chips.networking",
  "foundation.chips.volumes",
  "foundation.chips.observability",
  "foundation.chips.secrets",
  "foundation.chips.templates",
  "foundation.chips.metering",
  "foundation.chips.regionReplica",
  "foundation.chips.controlPlane",
] as const

export function Foundation() {
  return (
    <>
      <Phase n={<CT k="foundation.phaseN" />} label={<CT k="foundation.phase" />} />
      <SlideHead eyebrow={<CT k="foundation.eyebrow" />} title={<CT k="foundation.title" rich />} />
      <div className="two">
        <div className="card">
          <div className="ct">
            <CT k="foundation.team.title" />
          </div>
          <div className="cd">
            <CT k="foundation.team.desc" />
          </div>
        </div>
        <div className="card accent">
          <div className="ct">
            <CT k="foundation.platform.title" />
          </div>
          <div className="cd">
            <CT k="foundation.platform.desc" />
          </div>
        </div>
      </div>
      <Callout>
        <CT k="foundation.callout" />
      </Callout>
      {/* proof-of-capability grid: one shared system, many capabilities */}
      <div className="proofgrid">
        {FOUNDATION_CHIPS.map((k) => (
          <div className="proofcell" key={k}>
            <span>
              <CT k={k} />
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------- 09 · What ParsLinks brings (non-defensive) ---------------- */

const BRINGS_ITEMS = [
  "brings.item.softwareEng",
  "brings.item.controlPlane",
  "brings.item.productArch",
  "brings.item.dx",
  "brings.item.automation",
  "brings.item.observability",
  "brings.item.metering",
  "brings.item.integration",
  "brings.item.platform",
] as const

export function WhatBrings() {
  return (
    <>
      <SlideHead eyebrow={<CT k="brings.eyebrow" />} title={<CT k="brings.title" rich />} />
      {/* capability index: editorial two-column list, not a card grid */}
      <div className="caplist">
        {BRINGS_ITEMS.map((k, i) => (
          <div className="cap" key={k}>
            <span className="ci">{String(i + 1).padStart(2, "0")}</span>
            <CT k={k} />
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------- 10 · Partnership models ---------------- */

const MODELS: { name: string; desc: string }[] = [
  { name: "models.infraBacked.name", desc: "models.infraBacked.desc" },
  { name: "models.jointDev.name", desc: "models.jointDev.desc" },
  { name: "models.whiteLabel.name", desc: "models.whiteLabel.desc" },
  { name: "models.revenueShare.name", desc: "models.revenueShare.desc" },
  { name: "models.dedicatedCapacity.name", desc: "models.dedicatedCapacity.desc" },
  { name: "models.enterprise.name", desc: "models.enterprise.desc" },
]

export function PartnershipModels() {
  return (
    <>
      <Phase n={<CT k="models.phaseN" />} label={<CT k="models.phase" />} />
      <SlideHead eyebrow={<CT k="models.eyebrow" />} title={<CT k="models.title" rich />} />
      {/* option spectrum: models arranged along a shared rail — an option
          space, not a mandatory sequence */}
      <div className="spectrum">
        {MODELS.map((m) => (
          <div className="spec-cell" key={m.name}>
            <div>
              <div className="spec-name">
                <CT k={m.name as "models.infraBacked.name"} />
              </div>
              <div className="spec-desc">
                <CT k={m.desc as "models.infraBacked.desc"} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Callout center>
        <CT k="models.callout" />
      </Callout>
    </>
  )
}

/* ---------------- 11 · Pilot proposal ---------------- */

const PILOT_STEPS: { k: string; label: string; note?: string }[] = [
  { k: "01", label: "pilot.step1.label", note: "pilot.step1.note" },
  { k: "02", label: "pilot.step2.label" },
  { k: "03", label: "pilot.step3.label", note: "pilot.step3.note" },
  { k: "04", label: "pilot.step4.label" },
  { k: "05", label: "pilot.step5.label" },
  { k: "06", label: "pilot.step6.label" },
]

export function Pilot() {
  return (
    <>
      <Phase n={<CT k="pilot.phaseN" />} label={<CT k="pilot.phase" />} />
      <SlideHead eyebrow={<CT k="pilot.eyebrow" />} title={<CT k="pilot.title" rich />} />
      <Timeline
        steps={PILOT_STEPS.map((s) => ({
          k: s.k,
          label: <CT key={s.label} k={s.label as "pilot.step1.label"} />,
          note: s.note ? <CT key={s.note} k={s.note as "pilot.step1.note"} /> : undefined,
        }))}
      />
      <Callout>
        <CT k="pilot.callout" />
      </Callout>
    </>
  )
}

/* ---------------- 12 · Discussion ---------------- */

const DISCUSSION_QS = ["discussion.q1", "discussion.q2", "discussion.q3", "discussion.q4"] as const

export function Discussion() {
  return (
    <>
      <Phase n={<CT k="discussion.phaseN" />} label={<CT k="discussion.phase" />} />
      <SlideHead eyebrow={<CT k="discussion.eyebrow" />} title={<CT k="discussion.title" rich />} />
      {/* open frame: prompts, not dense content — conversation begins here */}
      <div className="discussion-frame">
        <Questions items={DISCUSSION_QS.map((k) => <CT key={k} k={k} />)} />
      </div>
    </>
  )
}
