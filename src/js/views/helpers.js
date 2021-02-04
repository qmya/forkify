export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    //always we convert the response into json
    const data = await res.json();
    //if the id is not right than throw a new error
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    console.log(res, data);
  } catch (error) {
    console.log(error);
  }
};
