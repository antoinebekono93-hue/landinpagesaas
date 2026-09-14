import { WhatsAppButton } from "./WhatsAppButton";

const profiles = [
  {
    title: "Développeurs",
    text: "Gagnez du temps en partant de bases existantes.",
  },
  {
    title: "Entrepreneurs",
    text: "Explorez des solutions pouvant servir de base à votre prochain projet.",
  },
  {
    title: "Entreprises",
    text: "Identifiez des outils adaptés à vos besoins numériques.",
  },
  {
    title: "Freelances & agences",
    text: "Accélérez certains projets clients avec des solutions existantes.",
  },
];

export function Profiles() {
  return (
    <section className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Pour qui ?</p>
          <h2 className="section-title">MERCO s&apos;adapte à votre profil</h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map((profile) => (
            <article key={profile.title} className="card p-6">
              <h3 className="text-base font-semibold text-white">
                {profile.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {profile.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton location="profiles" size="lg">
            Discuter de mon profil sur WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}