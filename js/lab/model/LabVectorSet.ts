// Copyright 2025, University of Colorado Boulder

/**
 * LabVectorSet is a specialization of VectorSet for the 'Lab' screen. It adds a symbol for the vectors in the set.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorSet, { VectorSetOptions } from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector from '../../common/model/Vector.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Graph from '../../common/model/Graph.js';
import Property from '../../../../axon/js/Property.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;

type LabVectorSetOptions = SelfOptions & StrictOmit<VectorSetOptions<Vector>, 'createAllVectors' | 'resultantTandemNameSymbol'>;

export default class LabVectorSet extends VectorSet<Vector> {

  public readonly symbolProperty: TReadOnlyProperty<string>;
  public readonly accessibleSymbolProperty: TReadOnlyProperty<string>;
  public readonly tandemNameSymbol: string;

  public constructor( graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      symbolProperty: TReadOnlyProperty<string>,
                      initialXYComponents: Vector2,
                      tandemNameSymbol: string,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      providedOptions: LabVectorSetOptions ) {

    const accessibleSymbolProperty = RichText.getAccessibleStringProperty( symbolProperty );

    const options = optionize<LabVectorSetOptions, SelfOptions, VectorSetOptions<Vector>>()( {

      // Creates the complete set of non-resultant vectors for the vector set.
      createAllVectors: ( vectorSet: VectorSet<Vector> ): Vector[] =>
        createAllVectors( vectorSet, graph, selectedVectorProperty, options.coordinateSnapMode,
        componentVectorStyleProperty, initialXYComponents, symbolProperty, accessibleSymbolProperty,
          tandemNameSymbol, options.tandem.createTandem( 'allVectors' ) ),

      // Resultant (sum) vector is labeled with 's' and the vector set symbol subscript.
      resultantSymbolProperty: new DerivedProperty(
        [ VectorAdditionSymbols.sStringProperty, symbolProperty ],
        ( sString, vectorSetSymbol ) => `${sString}<sub>${vectorSetSymbol}</sub>` ),

      //  Symbol for the resultant (sum) vector used in tandem names - 'su', 'sv', etc.
      resultantTandemNameSymbol: `s${tandemNameSymbol}`
    }, providedOptions );

    super( graph, selectedVectorProperty, componentVectorStyleProperty, options );

    this.symbolProperty = symbolProperty;
    this.accessibleSymbolProperty = accessibleSymbolProperty;
    this.tandemNameSymbol = tandemNameSymbol;
  }

  /**
   * Gets the first available vector that is not active.
   */
  public getFirstAvailableVector(): Vector | null {
    let availableVector: Vector | null = null;
    for ( let i = 0; i < this.allVectors.length && availableVector === null; i++ ) {
      const vector = this.allVectors[ i ];
      if ( !this.activeVectors.includes( vector ) ) {
        availableVector = vector;
      }
    }
    return availableVector;
  }
}

/**
 * Creates all vectors related to a vector set.
 */
function createAllVectors( vectorSet: VectorSet<Vector>,
                           graph: Graph,
                           selectedVectorProperty: Property<Vector | null>,
                           coordinateSnapMode: CoordinateSnapMode,
                           componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                           xyComponents: Vector2,
                           symbolProperty: TReadOnlyProperty<string>,
                           accessibleSymbolProperty: TReadOnlyProperty<string>,
                           tandemNameSymbol: string,
                           parentTandem: Tandem ): Vector[] {

  const tailPosition = new Vector2( 0, 0 );

  const vectors: Vector[] = [];

  // Iterate from 1 so that tandem names have 1-based indices.
  for ( let i = 1; i <= VectorAdditionConstants.LAB_VECTORS_PER_VECTOR_SET; i++ ) {
    const vector = new Vector( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {

      // e.g. 'v<sub>3</sub>'
      symbolProperty: new DerivedProperty( [ symbolProperty ], symbol => `${symbol}<sub>${i}</sub>` ),

      // e.g. 'v sub 3'
      accessibleSymbolProperty: new PatternStringProperty( VectorAdditionStrings.a11y.symbolSubSubscriptStringProperty, {
        symbol: accessibleSymbolProperty,
        subscript: i
      } ),
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,

      // e.g. 'v3Vector'
      tandem: parentTandem.createTandem( `${tandemNameSymbol}${i}Vector` ),

      // e.g. 'v3'
      tandemNameSymbol: `${tandemNameSymbol}${i}`
    } );
    vectors.push( vector );
  }
  return vectors;
}

vectorAddition.register( 'LabVectorSet', LabVectorSet );