# Sprawozdanie 

Opis
- [Skanowanie zagrożeń](#Skanowanie-zagrożeń)
- [Sprawdzenie ctirical i high](#Sprawdzenie-critical-i-high)
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

![image](https://github.com/Indrawi1/lab9/assets/98088474/57b37d23-80fd-4304-9a71-a219a3018ee8)



### Sprawdzenie critical i high

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

![image](https://github.com/Indrawi1/lab9/assets/98088474/641cabbf-4576-47b2-9fe7-9ca1f8f64a09)



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
![image](https://github.com/Indrawi1/lab9/assets/98088474/6b7e6d38-a61e-4b06-ad60-a8a3ca8e6173)


Obraz na github
![image](https://github.com/Indrawi1/lab9/assets/98088474/62f41354-8d72-4b6b-b8ef-ab42caf3910c)

https://github.com/users/Indrawi1/packages/container/lab9/versions

Obraz na dockerhub
![image](https://github.com/Indrawi1/lab9/assets/98088474/5e02a2fd-1952-4158-95ef-de0e50684c6a)


Wynik działania Dockerhub
![image](https://github.com/Indrawi1/lab9/assets/98088474/7934263d-dd86-4f72-b110-fedadfb46dac)

Wynik działania Github
![image](https://github.com/Indrawi1/lab9/assets/98088474/55bf1376-5ec1-4140-b4da-f6c44c89b360)







