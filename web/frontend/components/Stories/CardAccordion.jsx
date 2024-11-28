import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";

const CardAccordion = ({ label, body, headerStyles }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion allowToggle index={isOpen ? 0 : -1}>
      <AccordionItem border={"none"}>
        <Stack>
          <AccordionButton
            onClick={toggleAccordion}
            borderBottomRadius={isOpen ? 0 : 10}
            {...headerStyles}
          >
            <Stack as="span" flex="1">
              {label}
            </Stack>
            <AccordionIcon />
          </AccordionButton>
        </Stack>

        <AccordionPanel pb={3}>
          <Stack>{body}</Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default CardAccordion;
