//김석구의 메이플스토리 월드 데이터 연동 코드
function doGet(e) {
  //Get 요청 처리
  const { parameter } = e;
  //상수로 쿼리의 패러미터를 처리
  var errorcode = 1;
  //action에 해당하는 동작이 없을 경우의 오류 코드
  if (parameter.action == "MyGet") {
    //MyGet 액션에 대해 처리
    const { sheet, key } = parameter;
    //패러미터로부터 시트와 키 정보 받아옴
    var MySS = SpreadsheetApp.getActiveSpreadsheet();
    var CurSheet = MySS.getSheetByName(sheet);
    //연결된 스프레드시프로부터 현재 시트를 가져옴
    if (CurSheet == null) {
      //시트를 찾을 수 없다면 2번 오류를 반환
      errorcode = 2;
      return ContentService.createTextOutput(JSON.stringify({ errorcode })).setMimeType(ContentService.MimeType.JSON);
    }

    var MyRange = CurSheet.getDataRange().getValues();
    //전체 데이터 범위를 가져오고
    var row = MyRange.findIndex(row => row[0] == key) + 1;
    //해당 범위 내에서 키 값을 찾음
    if (row <= 0) {
      //키 값을 찾을 수 없다면 3번 오류 반환
      errorcode = 3;
      return ContentService.createTextOutput(JSON.stringify({ errorcode })).setMimeType(ContentService.MimeType.JSON);
    }

    const value = CurSheet.getRange(row,2).getValue();
    //검색된 목표 지점으로부터 값을 가져오고
    errorcode = 0;
    //성공했으므로 오류는 0번
    return ContentService.createTextOutput(JSON.stringify({ errorcode, value })).setMimeType(ContentService.MimeType.JSON);
    //값을 반환환
  }
  return ContentService.createTextOutput(JSON.stringify({ errorcode })).setMimeType(ContentService.MimeType.JSON);
  //동작이 지정되지 않았을 때의 1번 오류 반환
}

function doPost(e) {
  //Post 요청 처리
  const { parameter, postData: { contents, type } = {} } = e;
  //상수로 쿼리의 패러미터와 포스트된 데이터를 가져옴
  var errorcode = 1;
  //action에 해당하는 동작이 없을 때의 오류 코드드
  if (parameter.action == "MyPost"){
    //MyPost 액션을 처리리
    const { sheet, key, value } = JSON.parse(contents);
    //전달된 contents로부터 시트, 키, 값의 정보를 가져옴
    var MySS = SpreadsheetApp.getActiveSpreadsheet();
    var CurSheet = MySS.getSheetByName(sheet);
    //정보로부터 해당하는 시트를 가져오는 시도
    if (CurSheet == null) {
      //해당하는 시트가 없을때
      CurSheet = MySS.insertSheet();
      CurSheet.setName(sheet);
      //새로 시트를 만들어 삽입함
    }

    var MyRange = CurSheet.getDataRange().getValues();
    //전체 데이터 범위를 받아오고
    var row = MyRange.findIndex(row => row[0] == key) + 1;
    //해당 키가 있는지 검사함
    var Tkey, Tvalue;
    //각각 키와 값의 목표 지점
    if (row <= 0) {
      //지정된 키가 없다면 해당 시트의 가장 마지막에 붙임
      Tkey = CurSheet.getRange(CurSheet.getDataRange().getHeight() + 1,1);
      Tvalue = CurSheet.getRange(CurSheet.getDataRange().getHeight() + 1,2);
    }
    else {
      //지정된 키가 있다면 해당 값을 설정함
      Tkey = CurSheet.getRange(row,1);
      Tvalue = CurSheet.getRange(row,2);
    }

    Tkey.setValue(key);
    Tvalue.setValue(value);
    //각각의 값들을 설정
    errorcode = 0;
    //성공했으므로 오류 코드는 0
    return ContentService.createTextOutput(JSON.stringify({ errorcode, key, value })).setMimeType(ContentService.MimeType.JSON);
    //성공 처리 반환
  }
  return ContentService.createTextOutput(JSON.stringify({ errorcode })).setMimeType(ContentService.MimeType.JSON);
  //실패시 오류 코드 반환 처리
}
