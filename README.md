# Sprawozdanie 

Opis
- [Skanowanie zagrożeń](#Skanowanie-zagrożeń)
- [Sprawdzenie ctirical and high](#Sprawdzenie-critical-and-high)
- [Wysłanie obrazu na Github](#Wysłanie-obrazu-na-Github)

### Skanowanie zagrożeń


```yaml
name: Scan for vulnerabilities
        id: docker-scout-cves
        uses: docker/scout-action@v1
        with:
          command: cves
          image: ${{ steps.meta-dockerhub.outputs.tags }}
          sarif-file: sarif.output.json
          summary: true
```
Ten fragment kodu skanuje obraz platformy Docker za pomocą akcji Docker Scout

WYNIK:

![image](https://github.com/Indrawi1/lab9/assets/98088474/c3217115-46c7-42b1-950b-d01717914d80)


### Sprawdzenie ctirical and high

```yaml
name: Check for critical and high vulnerabilities
        id: check-cves
        run: |
          critical=$(jq '.runs[].results | map(select(.level == "error")) | length' sarif.output.json)
          high=$(jq '.runs[].results | map(select(.level == "warning")) | length' sarif.output.json)
          if [ "$critical" -ne 0 ] || [ "$high" -ne 0 ]; then
            echo "Znaleziono zagrożenia critical albo high"
            exit 1
          else
            echo "Nie naleziono critical albo high zagrożeń"
          fi
```
Ten fragment używa jq do filtrowania wyników skanowania i zliczania liczby wysokich  i crytycznych podatności. Zatem sprawdza, czy istnieją krytyczne lub wysokie podatności. Jeśli chociaż jedna z nich zostanie znaleziona, skrypt wyświetli komunikat "Znaleziono zagrożenia krytyczne lub wysokie" i zakończy działanie z błędem (kod wyjścia 1).

WYNIK:

![image](https://github.com/Indrawi1/lab9/assets/98088474/f4b46822-6dd7-48b9-8c80-77309e375f23)


### Wysłanie obrazu na Github

Ten fragment kodu zostanie wykonany tylko wtedy, gdy poprzedni krok zakończył się pomyślnie.

```yaml

      - name: Login to GitHub Container Registry
        if: ${{ steps.check-cves.outcome == 'success' }}
        uses: docker/login-action@v1
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      -
        name: Docker metadata definitions for GHCR
        id: meta-ghcr
        if: ${{ steps.check-cves.outcome == 'success' }}
        uses: docker/metadata-action@v4
        with:
          images: ghcr.io/${{ github.repository }}
          tags: latest

      -
        name: Build and push to GHCR
        if: ${{ steps.check-cves.outcome == 'success' }}
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta-ghcr.outputs.tags }}
```
Pierwszy krok: logowanie do GitHub Container Registry.

Drugi krok: definiowanie metadanych Docker dla repozytorium GitHub Container Registry.

Trzeci krok: budowanie i wysyłaniу obrazu Docker do GitHub Container Registry.


WYNIKI:

Logowanie
![image](https://github.com/Indrawi1/lab9/assets/98088474/ae157840-40d1-486f-8651-fe7475132304)

Obraz na github
![image](https://github.com/Indrawi1/lab9/assets/98088474/2c534321-bbab-4eef-9b42-b59085457f8c)

Obraz na dockerhub
![image](https://github.com/Indrawi1/lab9/assets/98088474/1533b018-0583-4ac6-a89a-26396e307218)

Wynik działania 
![image](https://github.com/Indrawi1/lab9/assets/98088474/37b1a28c-b311-4ea9-942a-af0560fadaf5)






