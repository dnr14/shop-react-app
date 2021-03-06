import { useCallback, useEffect, useState } from "react";
import { isFillWithZero } from "utils/DateUtil";
import { addItem } from "utils/LocalStorageUtil";
import { dateValidation, isEmpty, priceValidation } from "utils/Validation";

const useChange = (init, location) => {
  const [state, setState] = useState(init);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setState(init);
  }, [location, init]);

  const handleChange = useCallback(e => {
    const { name } = e.target;

    switch (name) {
      case "hours":
        setState(prevState => ({
          ...prevState,
          dates: { ...prevState.dates, [name]: e.target.value },
        }));
        return;

      case "minutes":
        setState(prevState => ({
          ...prevState,
          dates: { ...prevState.dates, [name]: e.target.value },
        }));
        return;

      case "date":
        setState(prevState => ({
          ...prevState,
          dateError: prevState.dateError && "",
          dates: { ...prevState.dates, selectedDate: e.target.value },
        }));
        return;

      case "price":
        const commaRemove = /,/gi;
        const value = e.target.value.replaceAll(commaRemove, "");

        // 길이 15자리 제한
        if (value.length > 15) {
          setState(prevState => (prevState.priceError === "" ? { ...prevState, priceError: "max Length" } : prevState));
          return;
        }

        // ex) 011233방지
        if (value.match(/^[0][0-9]/gi)) {
          setState(prevState =>
            prevState.priceError === "" ? { ...prevState, priceError: "is first number zero" } : prevState,
          );
          return;
        }

        const reg = /\D/gi;
        if (value.match(reg) !== null) {
          const replaceValue = value.replaceAll(reg, "");
          setState(prevState =>
            prevState.priceError === "" ? { ...prevState, [name]: replaceValue, priceError: "not digit" } : prevState,
          );
        } else if (value.match(reg) === null) {
          setState(preveState => {
            return { ...preveState, [name]: value, priceError: "" };
          });
        }
        return;

      case "category":
        setState(prevState => ({
          ...prevState,
          category: e.target.value,
          categoryError: prevState.categoryError && "",
        }));
        return;
      default:
        break;
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const { name } = e.target;
    const isDateValidation = dateValidation(state.dates.selectedDate);
    const isPriceValidation = priceValidation(state.price);
    const isCategoryValidation = isEmpty(state.category);

    const o = { ...state };

    if (isDateValidation.result) o.dateError = isDateValidation.error;
    if (isPriceValidation.result) o.priceError = isPriceValidation.error;
    if (isCategoryValidation) o.categoryError = "not selected";

    const date = `${state.dates.selectedDate} ${isFillWithZero(state.dates.hours)}:${isFillWithZero(
      state.dates.minutes,
    )}:00`;
    const time = new Date(date).getTime();
    const price = state.price;

    if (name === "income") {
      if (!isDateValidation.result && !isPriceValidation.result) {
        const array = JSON.parse(localStorage.getItem(`${name}Data`));
        const last = array === null ? undefined : array[array.length - 1];
        const id = last === undefined ? 1 : last.id + 1;
        addItem(`${name}Data`, {
          id,
          date,
          price,
          time,
          insertTime: new Date().getTime(),
        });
        setLoading(false);
        setState({ ...init, insertData: { date, price, time } });
        return;
      }
    } else {
      if (!isDateValidation.result && !isPriceValidation.result && !isCategoryValidation) {
        const category = state.category;
        const array = JSON.parse(localStorage.getItem(`${name}Data`));

        const last = array === null ? undefined : array[array.length - 1];
        const id = last === undefined ? 1 : last.id + 1;

        addItem(`${name}Data`, {
          id,
          date,
          price,
          category,
          time,
          insertTime: new Date().getTime(),
        });
        setLoading(false);
        setState({ ...init, insertData: { date, price, category, time } });
        return;
      }
    }
    setState(o);
  };
  return { loading, state, handleSubmit, handleChange };
};

export default useChange;
