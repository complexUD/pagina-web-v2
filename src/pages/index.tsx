import PageTitle from "@Components/Layout/PageTitle";
import HomeCover from "@Components/Cover/HomeCover";
import Ilustraciones from "@Components/Ilustraciones";
import Aliados from "@Components/Aliados";

import path from "path";
import getFilesPaths from "@Utils/getFilesPaths";

type HomeProps = {
  routes: string[];
};

export default function Inicio({ routes }: HomeProps) {
  return (
    <>
      <PageTitle title="Inicio" />
      <HomeCover randomRoutes={routes} />
      <Ilustraciones />
      <Aliados />
    </>
  );
}

export async function getStaticProps() {
  const pagesDirectory = path.join(process.cwd(), "src/pages");
  const routes = await getFilesPaths(pagesDirectory);

  // Exclude Home Route and 404
  const filteredRoutes = routes.filter(
    (route) => !["/", "/404"].includes(route)
  );

  return {
    props: {
      routes: filteredRoutes,
    },
  };
}
