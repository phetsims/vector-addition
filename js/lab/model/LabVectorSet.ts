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
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
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

type SelfOptions = EmptySelfOptions;

type LabVectorSetOptions = SelfOptions & StrictOmit<VectorSetOptions, 'resultantTandemNameSymbol'>;

export default class LabVectorSet extends VectorSet {

  // The complete set of vectors for this vector set, allocated when the sim starts.
  // Ordered by increasing vector index, e.g. v1, v2, v3,...
  public readonly allVectors: Vector[];

  public readonly symbolProperty: TReadOnlyProperty<string>;
  public readonly accessibleSymbolProperty: TReadOnlyProperty<string>;
  public readonly tandemNameSymbol: string;

  public constructor( graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      coordinateSnapMode: CoordinateSnapMode,
                      symbolProperty: TReadOnlyProperty<string>,
                      initialXYComponents: Vector2,
                      tandemNameSymbol: string,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorColorPalette: VectorColorPalette,
                      providedOptions: LabVectorSetOptions ) {

    const options = optionize<LabVectorSetOptions, SelfOptions, VectorSetOptions>()( {

      // VectorSetOptions
      // Resultant (sum) vectors are labeled with 's' and the vector set symbol subscript.
      resultantSymbolProperty: new DerivedProperty(
        [ VectorAdditionSymbols.sStringProperty, symbolProperty ],
        ( sString, vectorSetSymbol ) => `${sString}<sub>${vectorSetSymbol}</sub>` ),

      //  Symbol for the resultant (sum) vector used in tandem names - 'su', 'sv', etc.
      resultantTandemNameSymbol: `s${tandemNameSymbol}`
    }, providedOptions );

    super( graph, selectedVectorProperty, coordinateSnapMode, componentVectorStyleProperty, vectorColorPalette, options );

    this.symbolProperty = symbolProperty;
    this.accessibleSymbolProperty = RichText.getAccessibleStringProperty( symbolProperty );
    this.tandemNameSymbol = tandemNameSymbol;

    // Create vector instances.
    this.allVectors = createAllVectors( this, graph, selectedVectorProperty, coordinateSnapMode, initialXYComponents );
  }

  public override reset(): void {
    super.reset();
    this.allVectors.forEach( vector => vector.reset() );
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
function createAllVectors( vectorSet: LabVectorSet,
                           graph: Graph,
                           selectedVectorProperty: Property<Vector | null>,
                           coordinateSnapMode: CoordinateSnapMode,
                           xyComponents: Vector2 ): Vector[] {

  const tailPosition = new Vector2( 0, 0 );

  const vectors: Vector[] = [];

  // Iterate from 1 so that tandem names have 1-based indices.
  for ( let i = 1; i <= VectorAdditionConstants.LAB_VECTORS_PER_VECTOR_SET; i++ ) {
    const vector = new Vector( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, {

      // e.g. 'v<sub>3</sub>'
      symbolProperty: new DerivedProperty( [ vectorSet.symbolProperty ], symbol => `${symbol}<sub>${i}</sub>` ),

      // e.g. 'v sub 3'
      accessibleSymbolProperty: new PatternStringProperty( VectorAdditionStrings.a11y.indexedVectorPatternStringProperty, {
        symbol: vectorSet.accessibleSymbolProperty,
        index: i
      } ),
      coordinateSnapMode: coordinateSnapMode,

      // e.g. 'v3Vector'
      tandem: vectorSet.tandem.createTandem( `${vectorSet.tandemNameSymbol}${i}Vector` ),

      // e.g. 'v3'
      tandemNameSymbol: `${vectorSet.tandemNameSymbol}${i}`
    } );
    vectors.push( vector );
  }
  return vectors;
}

vectorAddition.register( 'LabVectorSet', LabVectorSet );