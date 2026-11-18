export function renderDomainExplorer({
  domains,
  grid,
  selection,
  store
}) {
  if (!Array.isArray(domains) || !grid || !selection) {
    throw new TypeError("Valid domains and render targets are required.");
  }

  const selectDomain = (domain) => {
    store.set("selected-domain", domain.id);

    selection.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = `Domän ${domain.id}: ${domain.title}`;

    const description = document.createElement("p");
    description.textContent = domain.description;

    const focus = document.createElement("p");
    focus.textContent = `Fokus: ${domain.focus.join(", ")}.`;

    selection.append(heading, description, focus);
  };

  for (const domain of domains) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "domain-card";

    const title = document.createElement("strong");
    title.textContent = `Domän ${domain.id}: ${domain.title}`;

    const weight = document.createElement("span");
    weight.className = "domain-weight";
    weight.textContent = `${domain.weight}% av provets innehåll`;

    const description = document.createElement("span");
    description.textContent = domain.description;

    button.append(title, weight, description);
    button.addEventListener("click", () => selectDomain(domain));
    grid.append(button);
  }

  const selectedId = store.get("selected-domain", null);
  const selected = domains.find((domain) => domain.id === selectedId);

  if (selected) {
    selectDomain(selected);
  }
}
