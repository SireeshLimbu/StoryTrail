import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building, Landmark, GraduationCap, Plane, Castle, Trophy } from "lucide-react";

const audiences = [
  {
    icon: Building,
    title: "Cities & municipalities",
  },
  {
    icon: Landmark,
    title: "Museums & cultural institutions",
  },
  {
    icon: GraduationCap,
    title: "Schools & education providers",
  },
  {
    icon: Plane,
    title: "Tourism & destination marketing",
  },
  {
    icon: Castle,
    title: "Heritage sites & historical environments",
  },
  {
    icon: Trophy,
    title: "Group & company competitions",
  },
];

const WhoItsFor = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="who" ref={ref} className="py-32 bg-card text-card-foreground">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-display font-semibold tracking-wide uppercase text-sm">
            Who It's For
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold text-card-foreground">
            Made for places that want to{" "}
            <span className="text-gradient">tell their story</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            We truly believe the best stories and trails are known locally and better told with a local voice. Since we want our stories and walks to be of highest quality please contact us if you have a trail or story you believe should be experienced!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-background rounded-2xl p-6 shadow-soft hover:shadow-warm transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-warm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <audience.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold leading-snug text-foreground">
                {audience.title}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center text-foreground/70 text-lg leading-relaxed max-w-3xl mx-auto"
        >
          If you have ideas of stories and walks or have other ideas or questions, please contact us!
        </motion.p>
      </div>
    </section>
  );
};

export default WhoItsFor;
