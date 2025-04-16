import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const SpecialBanner = () => {
  return (
    <section className="bg-yellow-500 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="text-dark mb-4 md:mb-0">
            <p className="font-medium text-lg">Today's Special: Butter Chicken with Garlic Naan</p>
            <p className="text-sm">Available all day. Limited portions.</p>
          </div>
          <Link href="#reservation">
            <Button variant="secondary" className="bg-dark hover:bg-dark/90 text-white px-6 py-2 rounded-full transition-colors text-sm font-medium">
              Reserve Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpecialBanner;
