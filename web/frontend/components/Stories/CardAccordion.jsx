import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CardAccordion = ({
  label,
  body,
  headerStyles,
  rightSide,
  openAccordion = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(true);
  }, [openAccordion]);

  return (
    <Accordion allowToggle index={isOpen ? 0 : -1}>
      <AccordionItem border={"none"}>
        <HStack m={3} justifyContent={"space-between"}>
          <HStack>
            <AccordionButton
              className="live-products-accordion-btn"
              onClick={toggleAccordion}
              // borderBottomRadius={isOpen ? 0 : 10}
              p={2}
              borderRadius={10}
              gap={2}
              {...headerStyles}
            >
              <Stack w={"fit-content"}>{label}</Stack>
              <AccordionIcon color={"#757575"} />
            </AccordionButton>
          </HStack>

          <HStack>{rightSide}</HStack>
        </HStack>

        <AccordionPanel pb={3}>
          <Stack>{body}</Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default CardAccordion;
