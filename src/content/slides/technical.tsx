"use client"

import { CT } from "@/content/edit"
import { Callout, Card, Defs, Flow, Lede, Plane, PConn, SlideHead, StateTag } from "@/components/kit"

/* ==================================================================
   TECHNICAL DEEP DIVE — optional branch (presenter may skip)
   Uses a "Current" vs "Target" discipline: planned subsystems are
   explicitly labelled, never shown as production-ready.
   All copy lives in src/content/presentation.json (t_* keys).
   ================================================================== */

/* ---------------- T1 · Architecture overview ---------------- */

export function TechOverview() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_overview.eyebrow" />} title={<CT k="t_overview.title" rich />} />
      <div>
        <Plane code="Developer / Git" sub={<CT k="t_overview.plane1.sub" />} items={["Push", "CLI", "API"]} />
        <PConn />
        <Plane hero accentSub code="Control Plane" sub={<CT k="t_overview.plane2.sub" />} items={["Build System", "Runtime Layer", "Platform Services"]} />
        <PConn />
        <Plane code="Orchestration" sub={<CT k="t_overview.plane3.sub" />} items={["Scheduling", "Placement", "Routing"]} />
        <PConn />
        <Plane infra code={<CT k="t_overview.plane4.code" />} sub={<CT k="t_overview.plane4.sub" />} items={["Compute", "Storage", "Network"]} />
      </div>
      <Lede muted>
        <CT k="t_overview.lede" />
      </Lede>
    </>
  )
}

/* ---------------- T2 · Planes ---------------- */

export function TechPlanes() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_planes.eyebrow" />} title={<CT k="t_planes.title" rich />} />
      <div>
        <Plane code="Developer Plane" sub={<CT k="t_planes.p1.sub" />} items={["Git integration", "CLI", "API", "Dashboard"]} />
        <PConn />
        <Plane hero accentSub code="Control Plane" sub={<CT k="t_planes.p2.sub" />} items={["Projects", "Deployments", "Scheduler", "Config", "Secrets", "Domains"]} />
        <PConn />
        <Plane code="Execution Plane" sub={<CT k="t_planes.p3.sub" />} items={["Build workers", "App runtime", "Containers", "Health checks"]} />
        <PConn />
        <Plane infra code="Infrastructure Plane" sub={<CT k="t_planes.p4.sub" />} items={["Compute", "Storage", "Network", "DNS"]} />
      </div>
      <Callout>
        <CT k="t_planes.callout" />
      </Callout>
    </>
  )
}

/* ---------------- T3 · Deployment lifecycle ---------------- */

export function TechLifecycle() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_lifecycle.eyebrow" />} title={<CT k="t_lifecycle.title" rich />} />
      <Flow
        nodes={[
          { code: "Git Push" },
          { code: "Source Detect" },
          { code: "Build" },
          { code: "Artifact" },
          { code: "Isolated Deploy" },
          { code: "Health Check" },
          { code: "Traffic Route" },
          { code: "Production", hero: true },
        ]}
      />
      <Callout>
        <strong>
          <span className="tk">Commit → Deployment</span>
        </strong>
        <CT k="t_lifecycle.callout" />
      </Callout>
    </>
  )
}

/* ---------------- T4 · Service runtime model ---------------- */

export function TechRuntime() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_runtime.eyebrow" />} title={<CT k="t_runtime.title" rich />} />
      <div className="two">
        <Flow
          vert
          nodes={[
            { code: "Tenant", sub: <CT k="t_runtime.tenant.sub" /> },
            { code: "Namespace / Sandbox", sub: <CT k="t_runtime.namespace.sub" /> },
            { code: "Container / microVM", sub: <CT k="t_runtime.container.sub" />, hero: true },
            { code: "cgroups · seccomp · netns" },
          ]}
        />
        <div className="stack">
          <Card title={<CT k="t_runtime.resources.title" />} desc={<CT k="t_runtime.resources.desc" />} />
          <Card title={<CT k="t_runtime.network.title" />} desc={<CT k="t_runtime.network.desc" />} />
          <Card title={<CT k="t_runtime.os.title" />} desc={<CT k="t_runtime.os.desc" />} />
        </div>
      </div>
    </>
  )
}

/* ---------------- T5 · Networking ---------------- */

export function TechNetworking() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_networking.eyebrow" />} title={<CT k="t_networking.title" rich />} />
      <div className="two">
        <Card accent k="Current">
          <Defs
            rows={[
              { k: "ingress", v: <CT key="i" k="t_networking.cur.ingress" /> },
              { k: "domains", v: <CT key="d" k="t_networking.cur.domains" /> },
              { k: "routing", v: <CT key="r" k="t_networking.cur.routing" /> },
            ]}
          />
        </Card>
        <Card k="Target">
          <Defs
            rows={[
              { k: "anycast", v: <CT key="a" k="t_networking.tgt.anycast" /> },
              { k: "edge routers", v: <CT key="e" k="t_networking.tgt.edgeRouters" /> },
              { k: "multi-site", v: <CT key="m" k="t_networking.tgt.multiSite" /> },
            ]}
          />
        </Card>
      </div>
      <Callout>
        <StateTag kind="current" /> <CT k="t_networking.callout.current" /> <StateTag kind="target" />{" "}
        <CT k="t_networking.callout.target" />
      </Callout>
    </>
  )
}

/* ---------------- T6 · Storage / volumes ---------------- */

export function TechStorage() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_storage.eyebrow" />} title={<CT k="t_storage.title" rich />} />
      <div className="g2">
        <Card title={<CT k="t_storage.volumes.title" />} desc={<CT k="t_storage.volumes.desc" />} />
        <Card title={<CT k="t_storage.objectStorage.title" />} desc={<CT k="t_storage.objectStorage.desc" />} />
        <Card title={<CT k="t_storage.infraLayer.title" />} desc={<CT k="t_storage.infraLayer.desc" />} />
        <Card title={<CT k="t_storage.backup.title" />} desc={<CT k="t_storage.backup.desc" />} />
      </div>
    </>
  )
}

/* ---------------- T7 · Observability ---------------- */

export function TechObservability() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_observability.eyebrow" />} title={<CT k="t_observability.title" rich />} />
      <div className="g3">
        <Card title={<CT k="t_observability.logs.title" />} desc={<CT k="t_observability.logs.desc" />} />
        <Card title={<CT k="t_observability.metrics.title" />} desc={<CT k="t_observability.metrics.desc" />} />
        <Card title={<CT k="t_observability.health.title" />} desc={<CT k="t_observability.health.desc" />} />
      </div>
    </>
  )
}

/* ---------------- T8 · Identity / security ---------------- */

export function TechSecurity() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_security.eyebrow" />} title={<CT k="t_security.title" rich />} />
      <div className="g3">
        <Card title={<CT k="t_security.auth.title" />} desc={<CT k="t_security.auth.desc" />} />
        <Card title={<CT k="t_security.access.title" />} desc={<CT k="t_security.access.desc" />} />
        <Card title={<CT k="t_security.secrets.title" />} desc={<CT k="t_security.secrets.desc" />} />
        <Card title={<CT k="t_security.isolation.title" />} desc={<CT k="t_security.isolation.desc" />} />
        <Card title={<CT k="t_security.tls.title" />} desc={<CT k="t_security.tls.desc" />} />
        <Card title={<CT k="t_security.netpol.title" />} desc={<CT k="t_security.netpol.desc" />} />
      </div>
    </>
  )
}

/* ---------------- T9 · Metering / billing ---------------- */

export function TechMetering() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_metering.eyebrow" />} title={<CT k="t_metering.title" rich />} />
      <Flow
        nodes={[
          { code: "Usage events", sub: <CT k="t_metering.usage.sub" /> },
          { code: "Aggregate", sub: <CT k="t_metering.aggregate.sub" /> },
          { code: "Metered units", sub: <CT k="t_metering.units.sub" />, hero: true },
          { code: "Billing adapter", sub: <CT k="t_metering.adapter.sub" /> },
        ]}
      />
      <Callout>
        <CT k="t_metering.callout" />
      </Callout>
    </>
  )
}

/* ---------------- T10 · Region / replica (target) ---------------- */

export function TechRegion() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_region.eyebrow" />} title={<CT k="t_region.title" rich />} />
      <div className="two">
        <Card k="Current">
          <Defs
            rows={[
              { k: "single pool", v: <CT key="sp" k="t_region.cur.singlePool" /> },
              { k: "replica concept", v: <CT key="rc" k="t_region.cur.replica" /> },
            ]}
          />
        </Card>
        <Card k="Target">
          <Defs
            rows={[
              { k: "multi-region", v: <CT key="mr" k="t_region.tgt.multiRegion" /> },
              { k: "failover", v: <CT key="fo" k="t_region.tgt.failover" /> },
            ]}
          />
        </Card>
      </div>
      <Callout>
        <StateTag kind="target" /> <CT k="t_region.callout" />
      </Callout>
    </>
  )
}

/* ---------------- T11 · Integration with partner infra ---------------- */

const INTEGRATION_CARDS: { t: string; d: string }[] = [
  { t: "t_integration.compute.title", d: "t_integration.compute.desc" },
  { t: "t_integration.storage.title", d: "t_integration.storage.desc" },
  { t: "t_integration.network.title", d: "t_integration.network.desc" },
  { t: "t_integration.billing.title", d: "t_integration.billing.desc" },
  { t: "t_integration.capacity.title", d: "t_integration.capacity.desc" },
  { t: "t_integration.ops.title", d: "t_integration.ops.desc" },
]

export function TechIntegration() {
  return (
    <>
      <SlideHead eyebrow={<CT k="t_integration.eyebrow" />} title={<CT k="t_integration.title" rich />} />
      <div className="g3">
        {INTEGRATION_CARDS.map((c) => (
          <Card key={c.t} title={<CT k={c.t as "t_integration.compute.title"} />} desc={<CT k={c.d as "t_integration.compute.desc"} />} />
        ))}
      </div>
    </>
  )
}
