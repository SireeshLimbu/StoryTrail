import WelcomeNavbar from "@/components/welcome/WelcomeNavbar";
import { TrailExperience } from "@/components/welcome/trail";
import WelcomeFooter from "@/components/welcome/WelcomeFooter";

const WelcomePage = () => {
  return (
    <main className="relative min-h-screen">
      <WelcomeNavbar />
      <TrailExperience />
      <WelcomeFooter />
    </main>
  );
};

export default WelcomePage;
