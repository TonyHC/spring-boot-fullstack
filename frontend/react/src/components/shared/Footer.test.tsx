import {describe, test} from "vitest";
import {renderWithProviders} from "../../test/mockedStoreWrapper.tsx";
import Footer from "./Footer.tsx";
import {screen} from "@testing-library/react";

describe('When the Footer component is displayed', () => {
   test('it should show a link to the application GitHub', () => {
      renderWithProviders(
          <Footer/>
      );

      const footerLink = screen.getByRole('link', {
          name: /demo/i
      });

      expect(footerLink).toHaveAttribute('href', 'https://github.com/TonyHC/spring-boot-fullstack');
   });
});