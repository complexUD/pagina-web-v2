import { useRef, useState, FormEvent, ChangeEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import cn from "classnames";

import { Button, Container, Form } from "react-bootstrap";

import styles from "./Suscription.module.scss";
import SuscriptionModal from "./SuscriptionModal";

const emailTest = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/i;
export default function Suscription() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChangeEmail = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setEmail(value);
    setIsValid(emailTest.test(value));
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!isValid) return;

    await recaptchaRef.current?.executeAsync();
    setShowModal(true);

    const form = ev.target as HTMLFormElement;
    form.submit();

    setEmail("");
    setIsValid(false);
    recaptchaRef.current?.reset();
  };

  return (
    <Container fluid className={cn("py-4 bg-dark", styles.suscription)}>
      <h4 className={styles.suscriptionTitle}>Suscríbete a Nuestro Boletín</h4>
      <Form
        method="POST"
        action={process.env.NEXT_PUBLIC_SUSCRIPTION_ACTION}
        target="suscription-result"
        className={styles.suscriptionFrom}
        onSubmit={handleSubmit}
      >
        <input name="empId" value="31102" readOnly hidden />
        <input name="formId" value="3" readOnly hidden />
        <input name="lang" value="es" readOnly hidden />
        <input type="checkbox" name="privacy" checked readOnly hidden />
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_SUSCRIPTION_RECAPTCHA!}
        />
        <Form.Control
          value={email}
          onChange={handleChangeEmail}
          className={styles.suscriptionInput}
          type="email"
          name="EMAIL"
          placeholder="Ingresa tu correo"
          maxLength={250}
          minLength={7}
          required
        />
        <Button
          variant="secondary"
          className={styles.suscriptionButton}
          type="submit"
          disabled={!isValid}
        >
          Enviar
        </Button>
      </Form>
      <SuscriptionModal
        targetName="suscription-result"
        show={showModal}
        onClose={() => setShowModal(false)}
      />
      <p className={styles.suscriptionLegend}>
        <small>
          Te estás suscribiendo para recibir nuestros boletines y novedades
          sobre productos. Al hacerlo estás aceptando nuestra{" "}
          <a className="text-secondary" href="#">
            política de privacidad
          </a>
          , pero puedes darte de baja en cualquier momento.
        </small>
      </p>
    </Container>
  );
}
